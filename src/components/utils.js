const getQueryParams = props => {
  if (!props) return {};

  const { location: { search = '' } = {} } = props;

  return search.slice(1).split('&').reduce((acc, qp) => {
    const [key, value] = qp.split('=')
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = { getQueryParams };
