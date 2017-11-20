import React from 'react';

class SelectItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="select-item">
                {this.props.children}
            </div>
        );
    }
}

export default SelectItem;
