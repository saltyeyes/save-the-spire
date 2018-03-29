import React, { Component } from "react";
class Filters extends Component { 
    render() {
        const styles = {
            filter: {
 
            }
        }

        return Object.entries(this.props.filters).map(([name, options]) => {
            return <div style={styles.filter}  key={name}>
                <strong>{name[0].toUpperCase()}{name.substring(1).toLowerCase()}</strong>
                <div>
                    {[...options].map((option) => {
                        let optionDisplay = option
                        if (typeof option === "number") {
                            if (name === "cost") {
                                optionDisplay = option == -2 ? "Unplayable" : option == -1 ? "X" : `${option}`
                            }
                        }
                        let key = `filter-${name.toLowerCase()}-${optionDisplay.toLowerCase()}`
                        return <div><label for={key}><input type="checkbox" id={key} onChange={event => this.props.onFilterChanged(name, option, event.target.checked)} /> {optionDisplay[0].toUpperCase()}{optionDisplay.substring(1).toLowerCase()}</label></div>
                    })}
                </div>
            </div>
        })
    }
}


export default Filters