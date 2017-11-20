import React from 'react';

class Select extends React.Component {
    constructor(props) {
        super(props);
    }

    renderChildren() {
        return (
            <div className="select-options">
                {this.props.children}
            </div>
        );
    }

    render() {
        var selectedChild = this.props.children.find(elem => elem.props.value === this.props.selected) || this.props.children[0];

        return (
            <div className="select">
                <div className="select-box">{selectedChild.props.children}</div>
                {this.renderChildren()}
            </div>
        );
    }
}

export default Select;
