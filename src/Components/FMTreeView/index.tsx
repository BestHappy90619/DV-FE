import * as React from 'react';
import JqxTree, { ITreeProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxtree';

class TreeView extends React.PureComponent<{}, ITreeProps>{
  private treeA = React.createRef<JqxTree>();
  private treeB = React.createRef<JqxTree>();
  private logStart = React.createRef<HTMLDivElement>();
  private logEnd = React.createRef<HTMLDivElement>();
  private textarea = React.createRef<HTMLTextAreaElement>();
  
  constructor(props: {}) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.dragStartTreeA = this.dragStartTreeA.bind(this);
    this.dragStartTreeB = this.dragStartTreeB.bind(this);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.dragEndTreeA = this.dragEndTreeA.bind(this);
    this.dragEndTreeB = this.dragEndTreeB.bind(this);
  }

  public render() {
    return (
      <div>
        <div style={{ float: 'left' }}>
          <JqxTree theme={'material-purple'}
            ref={this.treeA}
            style={{ float: 'left', marginLeft: '0px' }}
            onDragStart={this.dragStartTreeA}
            onDragEnd={this.dragEndTreeA}
            width={220} height={330}
            dragStart={this.dragStart}
            >
            <ul >
              <li className="px-5 py-2">Home</li>
              <li className="px-5 py-2">
                Solutions
                <ul className="px-5 py-2">
                  <li className="px-5 py-2">Education</li>
                </ul>
              </li>
              <li className="px-5 py-2">Financial services</li>
              <li className="px-5 py-2">Community</li>
            </ul>
          </JqxTree>

        
        </div>

        <div style={{ fontSize: '13px', fontFamily: 'Verdana', paddingTop: '20px', clear: 'both' }}>
    
          <div ref={this.logStart} />
          <div ref={this.logEnd} />
          <br />
        </div>        
      </div>
    );
  }

  // Definitions for the properties-callbacks
  private dragStart(item: any): boolean {
    if (item.label === "Community") {
      return false;
    }

    return true;
  };

  private dragEnd(item: any): boolean {
    if (item.label === "Forum") {
      return false;
    }

    return true;
  }

  // Event handling
  private onDragStart(event: any): void {
    this.logStart.current!.innerText = 'Drag Start: ' + event.args.label;
    this.logEnd.current!.innerText = '';
  };

  private onDragEnd(event: any): void {
    this.logEnd.current!.innerText = 'Drag End';
    const args = event.args;
    if (!!args.label) {
      const ev = event.args.originalEvent;
      let x = ev.pageX;
      let y = ev.pageY;
      if (event.args.originalEvent && event.args.originalEvent.originalEvent && event.args.originalEvent.originalEvent.touches) {
        const touch = event.args.originalEvent.originalEvent.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
      }

      const rect = this.textarea.current!.getBoundingClientRect();
      const width = this.textarea.current!.clientWidth;
      const height = this.textarea.current!.clientHeight;
      const right = rect.left + width;
      const bottom = rect.top + height;
      if (x >= rect.left && x <= right) {
        if (y >= rect.top && y <= bottom) {
          this.textarea.current!.value = event.args.label;
        }
      }
    }
  };
  
  private dragStartTreeA(event: Event): void {
    this.onDragStart(event);
  }

  private dragEndTreeA(event: Event): void {
    this.onDragEnd(event);
  }

  private dragStartTreeB(event: Event): void {
    this.onDragStart(event);    
  }

  private dragEndTreeB(event: Event): void {
    this.onDragEnd(event);
  }
}

export default TreeView;
