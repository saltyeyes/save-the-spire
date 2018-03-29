import React, { Component } from 'react';
import Item from './Item'
import ToolTip from './Tooltip'

const hexToRgb = require("hex-rgb")

class PotionItem extends Item {

    state = {
        hover: false,
        tooltip: false
    }

    onMouseEnter = () => {
        this.setState({hover: true})
        setTimeout(() => this.setState({tooltip: true}), 100)
    }

    onMouseLeave = () => {
        this.setState({hover: false})
        setTimeout(() => this.setState({tooltip: false}), 100)
    }

    render() {
        const style = this.createStyle();
        if (this.props.active) {
            style.border = "2px solid red"
        }

        let key = this.props.name == "Potion Slot" ? null : this.props.name.split(" ")[0].toUpperCase()
        let potionInSlot = false
        if (key in potionTypes) {
            potionInSlot = true
        }

        return (
            <div id={this.props.id} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.props.onClick} style={style}>
                <img src={`/images/potions/${potionInSlot ? key.split(" ")[0].toLowerCase() : "placeholder"}.png`} />
                <ToolTip active={this.state.tooltip} id={this.props.id} style={this.tooltipStyle} description={this.props.item.DESCRIPTION} title={this.props.name} />
            </div>

        );
    }
}

export default PotionItem;
