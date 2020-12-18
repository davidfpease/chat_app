import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

import Dashboard from './dashboard';

const mapStateToProps = state => {
  
  return {
    loggedIn: state.session.isAuthenticated,
    currentUser: state.session.user,
  }
};

export default connect(
  mapStateToProps,
  { logout }
)(Dashboard);