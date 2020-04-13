import React, { PureComponent, useState, useCallback, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';

import { withRouter } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import ContentEditable from "react-contenteditable";
import { Auth, Storage } from 'aws-amplify';

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

const initialFiles = [];

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
  return str.slice(0, -4);
}

function Admin(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf, image/png',
  });

  const { pending, error } = useAuth();
  const [files, dispatch] = useReducer(reducer, acceptedFiles);

  if (acceptedFiles.length !== files.length) {
    console.log('setting files to', acceptedFiles);
    dispatch({ type: 'setFiles', files: acceptedFiles })
  }

  if (pending) {
    return (<div></div>);
  }

  if (!pending && error) {
    props.history.replace('/login');
    return (<div>Unauthorized</div>);
  }

  const handleEdit = (index, key) => e => {
    const { target: { value = '' } = {} } = e || {};
    const file = files[index];
    dispatch({ type: 'updateFile', index, key, value })
  }

  const handleUpload = () => {
    for (let i = 0; i < files.length; i++) {
      dispatch({ type: 'updateProgress', progress: 1, index: i })

      const file = files[i]
      const fileName = sanitizeString(file.fileName || file.name);
      const publishYear = sanitizeString(file.publishYear || '');
      const key = publishYear ? `${publishYear}/${fileName}` : `${fileName}`;
      Storage.put(key, file, { level: 'public' })
        .then(() => {
          console.log('done uploading', fileName);
          dispatch({ type: 'updateProgress', progress: 2, index: i })
        })
        .catch(console.error)
    }
  }

  return (
    <Container className="d-flex justify-content-center flex-column">
      <Header />
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
                <th style={{'width': '60%'}}>File Name</th>
                <th style={{'width': '30%'}}>Publish Year</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <UploadItem
                  key={`${index}-${file.name}`}
                  file={file}
                  index={index}
                  handleEdit={handleEdit}
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
  const { index, file, handleEdit } = props;

  return (
    <tr>
      <td>
        { !file.progress ? index + 1 : (
          file.progress == 1
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
    </tr>
  );
}

export default withRouter(Admin);
