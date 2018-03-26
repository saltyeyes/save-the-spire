import React, { Component } from 'react';
import Item from './Item'
import ToolTip from 'react-portal-tooltip'
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

    tooltipStyle = {
        style: {
            width: 320,
            minHeight: 64,
            background: "transparent",
            backgroundImage: "url(images/tooltip/tipTop.png), url(images/tooltip/tipBot.png), url(images/tooltip/tipMid.png)",
            backgroundPosition: "top, bottom, center",
            backgroundRepeat: "no-repeat, no-repeat, repeat-y",
            padding: 20,
            boxSizing: "border-box",
            boxShadow: false,
            fontFamily: "Kreon, serif",
            color: "white",
            fontSize: 16
        },
        arrowStyle: {
            color: false,
            borderColor: false
        }
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

    getTooltipContent() {
        return this.props.item.DESCRIPTION.split(" ").map((word, i) => {
            if (word.charAt(0) == "#") {
                let parts = word.match(/^#(.)([A-Za-z0-9]*)(.*?)$/)
                return <span><span style={this.tooltipTagStyle[parts[1]]}>{parts[2]}</span>{parts[3]} </span>
            } else {
                return word + " "
            }
        })
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
                <PotionCanvas type={potionTypes[key]} placeholder={!potionInSlot}/>
                <ToolTip active={this.state.tooltip} position="top" arrow="center" parent={`#${this.props.id}`} style={this.tooltipStyle} group="potions">
                    <span style={this.tooltipTagStyle.title}>{this.props.name}</span>
                    <div>{this.getTooltipContent()}</div>
                </ToolTip>
            </div>

        );
    }
}

class PotionTooltipTitle extends Component {
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

const potionSizes = {
    TINY: "t",
    SMALL: "s",
    MEDIUM: "m",
    LARGE: "l",
    HUGE: "h"
}

const potionTypes = {
    BLOCK: {
        size: potionSizes.SMALL,
        colors: {
            liquid: "#87ceeb"
        }
    },
    REGEN: {
        size: potionSizes.MEDIUM,
        colors: {
            liquid: "#ffffff",
            hybrid: "#bfbfbf"
        }
    },
    ENERGY: {
        size: potionSizes.MEDIUM,
        colors: {
            liquid: "#ffff00",
            spots:  "#ffa500"
        }
    },
    EXPLOSIVE: {
        size: potionSizes.HUGE,
        colors: {
            liquid: "#ffa500"
        }
    },
    FIRE: {
        size: potionSizes.LARGE,
        colors: {
            liquid: "#ff0000",
            hybrid: "#ffa500"
        }
    },
    DEXTERITY: {
        size: potionSizes.MEDIUM,
        colors: {
            liquid: "#7fff00"
        }
    },
    POISON: {
        size: potionSizes.LARGE,
        colors: {
            liquid: "#6b8e23",
            spots:  "#7fff00"
        }
    },
    STRENGTH: {
        size: potionSizes.SMALL,
        colors: {
            liquid: "#3f3f3f",
            spots:  "#ff7f50"
        }
    },
    SWIFT: {
        size: potionSizes.HUGE,
        colors: {
            liquid: "#0d429d",
            spots:  "#00ffff"
        }
    },
    WEAK: {
        size: potionSizes.HUGE,
        colors: {
            liquid: "#ee82ee",
            hybrid: "#b03060"
        }
    },
    ELIXIR: {
        size: potionSizes.TINY,
        colors: {
            liquid: "#ffd700",
            spots:  "#3f3f3f"
        }
    },
    ANCIENT: {
        size: potionSizes.LARGE,
        colors: {
            liquid: "#ffd700",
            spots:  "#00ffff"
        }
    },
    HEALTH: {
        size: potionSizes.TINY,
        colors: {
            liquid: "#7fff00"
        }
    }
}


class PotionCanvas extends Component {

    state = {
        imageCount: 0,
        images: {},
        context: null
    }

    addImage(key, uri) {
        let img = new Image()
        img.onload = () => {
            this.state.imageCount -= 1
            if (this.state.imageCount == 0 && key in this.state.images && this.state.images[key] == img) {
                this.renderImages()
            }
        }
        this.state.images[key] = img
        img.src = uri
    }

    doUpdate() {
        const canvas = this.refs.canvas
        const context = canvas.getContext('2d')
        this.state.context = context

        context.fillStyle = "white"
        context.clearRect(0, 0, canvas.width, canvas.height)

        if (typeof this.props.placeholder === "undefined" || !this.props.placeholder) {
            const colors = this.props.type.colors

            this.state.imageCount = 2 + ("liquid" in colors) + ("spots" in colors) + ("hybrid" in colors)

            this.addImage("glass",   `/images/potion/potion_${this.props.type.size}_glass.png`)
            this.addImage("outline", `/images/potion/potion_${this.props.type.size}_outline.png`)

            if ("liquid" in colors) this.addImage("liquid",  `/images/potion/potion_${this.props.type.size}_liquid.png`)
            if ("hybrid" in colors) this.addImage("hybrid",  `/images/potion/potion_${this.props.type.size}_hybrid.png`)
            if ("spots"  in colors) this.addImage("spots",   `/images/potion/potion_${this.props.type.size}_spots.png`)
        } else {
            let img = new Image()
            img.onload = () => context.drawImage(this.colorizeImage(img, "#ffffffc0"), 0, 0)
            img.src = "/images/potion/potion_placeholder.png"
        }
    }

    renderImages() {
        const context = this.state.context
        const colors = this.props.type.colors

        context.drawImage(this.state.images["outline"], 0, 0)
        if ("liquid" in colors) context.drawImage(this.colorizeImage(this.state.images["liquid"], colors.liquid),  0, 0)
        if ("hybrid" in colors) context.drawImage(this.colorizeImage(this.state.images["hybrid"], colors.hybrid),  0, 0)
        if ("spots"  in colors) context.drawImage(this.colorizeImage(this.state.images["spots"],  colors.spots),   0, 0)
        context.drawImage(this.state.images["glass"],   0, 0)
    }

    colorizeImage(img, color) {
        let newc = hexToRgb(color)

        let tempCanvas = document.createElement("canvas")
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        let tempContext = tempCanvas.getContext('2d')
        
        tempContext.drawImage(img, 0, 0)
        let imageData = tempContext.getImageData(0, 0, img.width, img.height)
        let data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
            let red = data[i + 0]
            let green = data[i + 1]
            let blue = data[i + 2]
            let alpha = data[i + 3]

            if (alpha == 0) {
                continue
            }

            let gs = Math.max(red, green, blue) / 255

            data[i + 0] = Math.round(newc.red * gs)
            data[i + 1] = Math.round(newc.green * gs)
            data[i + 2] = Math.round(newc.blue * gs)
            data[i + 3] = alpha * newc.alpha / 255
        }

        tempContext.putImageData(imageData, 0, 0)

        return tempCanvas
    }

    componentDidMount() {
        this.doUpdate()
    }

    componentDidUpdate() {
        this.doUpdate()
    }

    shouldComponentUpdate(nextProps) {
        return this.props.type != nextProps.type
    }

    render () {
        return <canvas ref="canvas" width={64} height={64}></canvas>
    }
}

export default PotionItem;
