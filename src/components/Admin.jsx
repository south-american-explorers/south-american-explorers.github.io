import React, { useState, useCallback, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { withRouter } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ContentEditable from "react-contenteditable";
import { Auth, Storage } from 'aws-amplify';
import { Document, Page } from 'react-pdf/dist/entry.webpack';

import Header from './Header';

const useAuth = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setPending(true);
    setError(null);
    return Auth.currentAuthenticatedUser()
      .catch(error => setError(error))
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return { pending, error };
};

function reducer(state, action) {
  switch (action.type) {
    case 'updateFile':
      return state.map((file, index) => {
        if (index === action.index) {
          file[action.key] = action.value
        }
        return file;
      });
    case 'updateProgress':
      state[action.index].progress = action.progress;
      return state.map(item => item);
    case 'setFiles':
      return action.files;
    default:
      return state;
  }
}

const sanitizeString = str => {
  let sanitized = str;
  if (str.indexOf('<br>') !== -1) {
    sanitized = str.slice(0, str.indexOf('<br>'))
  }

  // remove and file type endings
  sanitized = sanitized.split('.')[0];
  return sanitized
}

const canvasToFile = (canvas, name, type) => new Promise((resolve, reject) => {
  try {
    canvas.toBlob(blob => {
      return resolve(new File([blob], name, { type }));
    });
  } catch (e) {
    return reject(e);
  }
});

const DROPZONE_DEFAULTS = {
  accept: 'application/pdf',
};

function Admin(props) {
  const { pending, error } = useAuth();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(DROPZONE_DEFAULTS);
  const [files, dispatch] = useReducer(reducer, acceptedFiles);
  const [refs, setRefs] = useState([]);


  if (acceptedFiles.length !== files.length) {
    dispatch({ type: 'setFiles', files: acceptedFiles })
  }

  if (pending) {
    return (<div></div>);
  }

  if (!pending && error) {
    props.history.replace('/login');
    return (<div>Unauthorized</div>);
  }

  const setCanvasRef = index => ref => {
    if (!ref) return;
    
    const canvas = ref.getElementsByTagName('canvas')[0];
    if (!canvas) return;

    refs[index] = canvas;
    setRefs(refs);
  }

  const handleEdit = (index, key) => e => {
    const { target: { value = '' } = {} } = e || {};
    dispatch({ type: 'updateFile', index, key, value })
  }

  const handleUpload = () => {
    for (let i = 0; i < files.length; i++) {
      dispatch({ type: 'updateProgress', progress: 1, index: i })

      const file = files[i]
      const fileName = sanitizeString(file.fileName || file.name);
      const publishYear = sanitizeString(file.publishYear || '');
      const key = publishYear ? `${publishYear}/${fileName}` : `${fileName}`;

      const imageKey = `images/${key}`;

      canvasToFile(refs[i], imageKey, 'image/png')
        .then(thumbnailFile => {
          console.log('uploading image to key', imageKey, thumbnailFile);
          return Storage.put(imageKey, thumbnailFile, { level: 'public', contentType: 'image/png' })
        })      
        .then(() => {
          console.log('done uploading image to', imageKey)
          return Storage.put(key, file, { level: 'public', contentType: file.type })
        })
        .then(() => {
          console.log('done uploading file to', key);
          dispatch({ type: 'updateProgress', progress: 2, index: i })
        })
        .catch(console.error)
    }
  }

  const handleLogout = () => {
    Auth.signOut()
      .then(data => {
        props.history.push('/');
      })
      .catch(err => console.log(err));
  }

  return (
    <Container className="d-flex justify-content-center flex-column">
      <Header buttonTitle="Logout" onClick={handleLogout} />
      <Row className="justify-content-center flex-column">
        <div { ...getRootProps({ className: 'dropzone' }) }>
          <input { ...getInputProps() } />
          <p>Drag and drop some files here or click to select files</p>
          <em>(Only *.pdf files will be accepted)</em>
        </div>
        <div className="pad-tb-24" />
        <Row className="margin-0">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{'width': '10%'}}>#</th>
                <th style={{'width': '50%'}}>File Name</th>
                <th style={{'width': '30%'}}>Publish Year</th>
                <th style={{'width': '10%'}}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <UploadItem
                  key={`${index}-${file.name}`}
                  file={file}
                  index={index}
                  handleEdit={handleEdit}
                  setCanvasRef={setCanvasRef}
                />
              )) }
            </tbody>
          </Table>
        </Row>
        <Row className="header">
          <Col xs className="d-flex justify-content-end pad-0">
            <Button onClick={handleUpload} disabled={files.length === 0}>Upload</Button>
          </Col>
        </Row>
      </Row>
    </Container>
  )
}

function UploadItem(props) {
  const { index, file, handleEdit, setCanvasRef } = props;
  const renderLoader = () => <Spinner size="sm" animation="border" role="status" />

  return (
    <tr>
      <td>
        { !file.progress ? index + 1 : (
          file.progress === 1
            ? (<Spinner size="sm" animation="border" role="status" />)
            : (<span>✅</span>)
        ) }
      </td>
      <td>
        <ContentEditable
          html={file.fileName || file.name}
          onChange={ handleEdit(index, 'fileName') }
        />
      </td>
      <td>
        <ContentEditable
          html={file.publishYear !== undefined ? file.publishYear : '-'}
          onChange={ handleEdit(index, 'publishYear') }
        />
      </td>
      <td>
        <Document
          file={file}
          renderMode="svg"
          loading={renderLoader}
          inputRef={setCanvasRef(index)}
        >
          <Page
            width={125}
            renderMode="canvas"
            pageNumber={1}
            loading=""
          />
        </Document>
      </td>
    </tr>
  );
}

export default withRouter(Admin);
