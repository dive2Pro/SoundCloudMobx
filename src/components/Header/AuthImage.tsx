/**
 *
 */
import * as React from 'react';
import ArtWork from '../ArtWork';
import {SessionStore} from '../../store/SessionStore';
import {observable, action} from 'mobx';
import * as ReactDOM from 'react-dom';
import ButtonInline from '../ButtonInline';
import {inject, observer} from 'mobx-react';
import makeCatchoutside from '../../Hoc/makeCatchoutside';
const styles = require('./header.scss');

interface IDropDownProps {
  store: SessionStore;
  onClick: () => void;
}

@inject('userStore')
@observer
@makeCatchoutside
class DropDown extends React.PureComponent<IDropDownProps, any> {
  state = {isOpen: false};

  @action
  toggleDropdowning = () => {
    this.setState(prev => ({isOpen: !prev.isOpen}));
  };
  handleTouchOutside = () => {
    this.toggleDropdowning();
  };

  render() {
    const clazz = this.state.isOpen
      ? styles.dropdown_content_visible
      : styles.dropdown_content;
    const {user} = this.props.store;
    const aturl = (user && user.avatar_url) || '';
    return (
      <div className={styles.dropdown}>
        <ArtWork
          onClick={this.toggleDropdowning}
          style={{
            width: '50px',
            height: '50px'
          }}
          src={aturl}
          live={true}
        />
        <div className={clazz}>
          <ButtonInline onClick={this.props.onClick}>
            {!user ? 'Sign into SoundCloud' : 'Sign out'}
          </ButtonInline>
        </div>
      </div>
    );
  }
}
export default DropDown;
