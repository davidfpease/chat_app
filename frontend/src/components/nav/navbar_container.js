import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

import NavBar from './navbar';

const mapStateToProps = state => ({
  loggedIn: state.session.isAuthenticated,
  handle: state.session.user.handle,
});

export default connect(
  mapStateToProps,
  { logout }
)(NavBar);