import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SelectItem from './select-item';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        if(!this.props.value) {
            this.props.handleChange(this.props.children[0].props.value);
        }

        this.handlePopSelect = this.handlePopSelect.bind(this);
        this.hideSelect = this.hideSelect.bind(this);
        this.handleHideSelect = this.handleHideSelect.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleBoxMousedown = this.handleBoxMousedown.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    handlePopSelect() {
        var top_div = ReactDOM.findDOMNode(this);
        this.setState({
            active: true,
            rect: top_div.getBoundingClientRect(),
            body_rect: document.body.getBoundingClientRect()
        });
        window.addEventListener('resize', this.handleResize);
    }

    hideSelect() {
        this.setState({
            active: false
        });
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * @param  {MouseEvent} e
     */
    handleHideSelect(e) {
        e.stopPropagation();
        this.hideSelect();
    }

    /**
     * @param  {MouseEvent} e
     */
    handleSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        if(e.target.dataset.value) {
            this.hideSelect();
            if(e.target.dataset.value !== this.props.value) {
                this.props.onChange(e.target.dataset.value);
            }
        }
    }

    /**
     * @param  {MouseEvent} e
     */
    handleBoxMousedown(e) {
        e.stopPropagation();
    }

    handleResize() {
        this.hideSelect();
    }

    /**
     * @typedef {Object} SelectBoxPosition
     * @property {number} top
     * @property {number} scrollTop
     */

    /**
     * Calculate the position info for the dropdown box
     * @param  {number} num_item Number of items to show
     * @return {SelectBoxPosition}
     */
    calcPopPosition(num_item) {
        const padding = 8;
        //Index for the selected item
        var selected_idx = this.props.children.findIndex(item => item.props.value === this.props.value) || 0;
        //Total number of item
        var total_item = this.props.children.length;

        //Available space above
        var top_space = this.state.rect.top;
        //Number of items possible to put above
        var top_possible = Math.max(0, Math.floor((top_space - padding) / this.state.rect.height));
        //Number of items before the selected item that can be put above
        var top_item = Math.min(selected_idx, top_possible);
        //Avaialable space below
        var bottom_space = this.state.body_rect.bottom - this.state.rect.bottom;
        //Number of items possible to put below
        var bottom_possible = Math.max(0, Math.floor((bottom_space - padding) / this.state.rect.height));
        //Number of items after the selected item that can be put below
        var bottom_item = Math.min(total_item - selected_idx - 1, bottom_possible);
        // offset_top_num: number of items shown above the selected item in the box

        // First try to put the selected item right at the select box
        if(top_item + bottom_item + 1 >= num_item) {
            //Able to put the item at the box
            if(top_item + 1 >= Math.ceil(num_item / 2) && bottom_item >= Math.floor(num_item / 2)) {
                //No adjust needed, put the selected item in the middle
                var offset_top_num = Math.ceil(num_item / 2) - 1;
            }
            else if(top_item + 1 < Math.ceil(num_item / 2)) {
                //Not enough items above, use all of them
                var offset_top_num = top_item;
            }
            else {
                //Not enough items below, use all of them
                var offset_top_num = num_item - bottom_item - 1;
            }
            //The top coordinate the selected item
            var selected_top = this.state.rect.top;
        }
        else {
            //One side doesn't have enough item
            //Need to push the box by x * height where x is the smallest number that makes box in the viewport
            let push_x;
            if(top_item < top_possible) {
                //Too few item before selected
                var offset_top_num = top_item;
                //x = possible item below - actual number below selected
                //x is negative here
                push_x = bottom_item - (num_item - top_item - 1)
            }
            else {
                //Too few item after selected
                var offset_top_num = num_item - bottom_item - 1;
                //x = actual number below selected - possible item below
                //x is positive here
                push_x = (num_item - bottom_item - 1) - top_item
            }
            var selected_top = this.state.rect.top + push_x * this.state.rect.height;
        }
        //The index of the first element shown in the box
        var start_top_idx = selected_idx - offset_top_num;
        //Make sure the box is in the view
        var box_top = Math.min(this.state.body_rect.bottom - this.state.rect.height - padding, Math.max(padding, selected_top))
        return {
            top: box_top - padding - offset_top_num * this.state.rect.height,
            scrollTop: start_top_idx * this.state.rect.height
        };
    }

    renderChildren() {
        if(this.state.active) {
            const padding = 8;
            var num_item = Math.min(this.props.children.length, 9);
            var {top, scrollTop} = this.calcPopPosition(num_item);
            var style = {
                minWidth: this.state.rect.width + "px",
                left: this.state.rect.left + "px",
                top: top + "px",
                height: (num_item * this.state.rect.height + 2 * padding) + "px"
            };
            var decorated_children = this.props.children.map((item) => 
                <SelectItem key={item.props.value} value={item.props.value} selected={item.props.value === this.props.value}>
                    {item.props.children}
                </SelectItem>
            , this);
            return (
                <div className="select-options" onMouseDown={this.handleHideSelect}>
                    <div className="select-options-box"
                         style={style}
                         onClick={this.handleSelect}
                         onMouseDown={this.handleBoxMousedown}
                         ref={(div) => {div && (div.scrollTop = scrollTop);}}
                         >
                        {decorated_children}
                    </div>
                </div>
            );
        }
        else {
            return "";
        }
    }

    render() {
        var selectedChild = this.props.children.find(elem => elem.props.value === this.props.value) || this.props.children[0];

        return (
            <div className={cn("select", {"active": this.state.active})} onClick={this.handlePopSelect}>
                <div className="select-box">
                    <span className="select-text">{selectedChild.props.children}</span>
                    <span className="icon icon-down"></span>
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}

Select.defaultProps = {
    handleChange: () => {}
};

Select.propTypes = {
    handleChange: PropTypes.func
};

export default Select;
