import React, { Component, ChangeEvent } from 'react';
import {ObjectMap} from '../Utils/ObjectMap';

export {Selector};

class Selector<T> extends Component<{options: ObjectMap<T>, onSelect(result: T): void}> {
    _renderOption(name: string) {
        return(
            <option value={name}>{name}</option>
        )
    }

    _onChange(e: ChangeEvent<HTMLSelectElement>): void {
        const selected = e.target.value;
        console.log(selected);
        this.props.onSelect(this.props.options[selected]);
    }

    render() {
        return (
            <select onChange={this._onChange.bind(this)}>
                {Object.keys(this.props.options).map(this._renderOption)}
            </select>
        );
    }
}