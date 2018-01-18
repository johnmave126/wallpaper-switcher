import React from 'react';
import cn from 'classnames';

class SelectItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div data-value={this.props.value} className={cn("select-item", {selected: this.props.selected})}>
                {this.props.children}
            </div>
        );
    }
}

export default SelectItem;
