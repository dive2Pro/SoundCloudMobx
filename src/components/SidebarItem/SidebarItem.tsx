import * as React from 'react';
import {HomeLink} from '../Links';
import {observer} from 'mobx-react';
import {observable} from 'mobx/lib/mobx';
interface IPlaylistitemProp {
  title: string;
  id: number;
  tag: string;
}
export const PlaylistItem = observer((data: IPlaylistitemProp) => {
  return (
    <div className="list-item">
      <img src="#" alt="#" width={50} height={50} />
      <div className="item-info">
        <h4>{data.title}</h4>
      </div>
    </div>
  );
});

interface ISidebarItemProp {
  items: any[];
  title: string;
}

@observer
class SidebarItem extends React.Component<ISidebarItemProp, any> {
  state = {opened: false};
  @observable opened = false;
  handleOpened = () => {
    this.setState(preState => {
      return {
        opened: !preState.opened
      };
    });
    this.opened = !this.opened;
  };

  render() {
    const {items, title} = this.props;

    const {opened} = this.state;
    const clazz = opened ? 'list opened' : 'list';
    return (
      <div className="main">
        <div className="top">
          <div onClick={this.handleOpened}>
            <i>{opened ? 'V' : '>'}</i>
            <span>{title}</span>
          </div>
          <span>
            <HomeLink id={123}>
              {'View All'}
            </HomeLink>
          </span>
        </div>
        <div className={clazz}>
          {items.map(t => {
            const {} = t;
            return <div />;
          })}
        </div>
      </div>
    );
  }
}
export default SidebarItem;
