import {default as PortalToolTip} from 'react-portal-tooltip'
import React, { Component } from 'react';
import styles from './Tooltip.module.css'

class ToolTip extends Component {
    state = {
      active: false,
    }

    tooltipStyle = {
        style: {
            background: false,
            boxShadow: false
        },
        arrowStyle: false
    }

    tooltipTagStyle = {
        b: {
            color: "#87ceeb"
        },
        r: {
            color: "#ff6500"
        },
        g: {
            color: "#7fff00"
        },
        y: {
            color: "#efc851"
        },
        title: {
            color: "#efc851",
            outlineColor: "#3b3114",
            fontWeight: "bold"
        }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.active != this.state.active) {
          this.setState({active: nextProps.active})
      }
    }

    getTooltipContent() {
        return this.props.description.split(" ").map((word, i) => {
            if (word.charAt(0) == "#") {
                let parts = word.match(/^#(.)([A-Za-z0-9]*)(.*?)$/)
                return <span><span style={this.tooltipTagStyle[parts[1]]}>{parts[2]}</span>{parts[3]} </span>
            } else {
                return word + " "
            }
        })
    }

    render() {
        return <PortalToolTip active={this.state.active} position="top" parent={`#${this.props.id}`} style={this.tooltipStyle} group="potions">
                    <div className={styles.tooltip}>
                        <span style={this.tooltipTagStyle.title}>{this.props.title}</span>
                        <div className={styles.description}>{this.getTooltipContent()}</div>
                    </div>
                </PortalToolTip>
    }
}

class TooltipTitle extends Component {
    doUpdate() {
        const canvas = this.refs.canvas
        const context = canvas.getContext("2d")

        context.clearRect(0, 0, canvas.width, canvas.height)

        context.font = "20px Kreon"
        context.fillStyle = "#efc851"
        context.strokeStyle = "#3b3114"
        context.lineWidth = 3

        context.strokeText(this.props.title, 3, 24)
        context.fillText(this.props.title, 3, 24)
    }

    componentDidMount() {
        this.doUpdate()
    }

    componentDidUpdate() {
        this.doUpdate()
    }

    shouldComponentUpdate(nextProps) {
        return this.props.title != nextProps.title
    }

    render() {
        return <canvas ref="canvas" width={280} height={30}></canvas>
    }
}

export default ToolTip;