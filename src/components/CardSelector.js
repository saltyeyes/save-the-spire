import React, {Component} from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cards from "./CardsJSON";
import Item from "./Item";
import Search from './Search';
import Filters from './Filters';
import { actions } from "../utils/ReduxStore"

let filterOptions = {
    rarity: new Set(),
    color:  new Set(),
    cost:   new Set(),
    type:   new Set()
}

for (let [cardName, card] of Object.entries(cards)) {
    filterOptions.rarity.add(card.rarity)
    filterOptions.color.add(card.color)
    filterOptions.cost.add(card.cost)
    filterOptions.type.add(card.type)
}

class CardSelector extends Component {

    state = {
        upgraded: false,
        searchTerm: '',
        filters: {
            rarity: {},
            color:  {},
            cost:   {},
            type:   {}
        }
    }

    sortedCards = Object.keys(cards).sort();

    onSearchTermChanged = (searchTerm) => {
        this.setState({searchTerm});
    };

    onFilterChanged = (filter, option, value) => {
        this.setState({
            filters: {
                ...this.state.filters,
                [filter]: {
                    ...this.state.filters[filter],
                    [option]: value
                }
            }
        })
        
    }

    isFilterActive(filter) {
        return Object.entries(this.state.filters[filter]).some(([option, value]) => value)
    }

    getActiveFilterValues(filter) {
        return Object.entries(this.state.filters[filter]).filter(([option, value]) => value).map(([option, value]) => option)
    }

    toggleCheckbox = () => {
        this.setState({upgraded: !this.state.upgraded});
    };

    addCard(card) {
        this.props.actions.addCard({
            upgrades: this.state.upgraded ? 1 : 0, 
            id: card
        });
    }

    render() {

        const styles = {
          cards: {
              display: 'grid',
              boxSizing: 'border-box',
              overflowY: 'scroll',
              height: 'calc(100vh - 103px - 1.5rem)',
              alignContent: 'start'
          },
            upgrade: {
                height: '1.5rem',
                backgroundColor: '#d8d8d8',
                border: '1px solid',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        };

        const cardsList = this.sortedCards
            .filter(card => card.toLowerCase().startsWith(this.state.searchTerm.trim()))
            .filter(card => !this.isFilterActive("rarity") || this.getActiveFilterValues("rarity").includes(cards[card].rarity ))
            .filter(card => !this.isFilterActive("cost")   || this.getActiveFilterValues("cost").includes(`${cards[card].cost}`))
            .filter(card => !this.isFilterActive("type")   || this.getActiveFilterValues("type").includes(cards[card].type ))
            .filter(card => !this.isFilterActive("color")  || this.getActiveFilterValues("color").includes(cards[card].color ))
            .map((card, i) => <Item type="CardItem" onClick={() => this.addCard(card)} name={card + (this.state.upgraded ? '+' : '')} key={card}/>)

        return (
            <div>
                <Search onSearchTermChanged={this.onSearchTermChanged}/>
                <Filters onFilterChanged={this.onFilterChanged} filters={filterOptions}/>
                <div style={styles.upgrade}>
                    <input onChange={this.toggleCheckbox} type='checkbox' value={this.state.upgraded}/><label>upgraded</label>
                </div>
                <div style={styles.cards}>
                    {cardsList}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(null, mapDispatchToProps)(CardSelector)