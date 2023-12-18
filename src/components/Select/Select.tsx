import { useState } from "react";
import { POKEMONS } from "./constants";
import "./Select.css";

const NO_OPTION_SELECTED = -1;

const autoCompleteMatch = (value: string, options: Array<string>) => {
  if (value.length === 0) {
    return options;
  }

  const regex = new RegExp("^" + value, "i");

  return options.filter((option) => option.match(regex));
};

export const Select = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeOption, setActiveOption] = useState(NO_OPTION_SELECTED);
  const [inputValue, setInputValue] = useState("");

  const filteredOptions = autoCompleteMatch(inputValue, POKEMONS);

  return (
    <div className="select-wrapper">
      <label htmlFor="pokemon-autocomplete">Select Pokemons</label>
      <input
        className="select-input"
        id="pokemon-autocomplete"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="dropdown-list"
        aria-expanded={showDropdown}
        onClick={() => setShowDropdown(true)}
        onBlur={() => setShowDropdown(false)}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <ul
        className={`dropdown ${
          showDropdown ? "dropdown--open" : "dropdown--closed"
        }`}
        role="listbox"
        aria-label="Pokemons"
        id="dropdown-list"
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((pokemon, index) => {
            const selected = index === activeOption;
            return (
              <li
                className={`dropdown-option ${
                  selected ? "dropdown-option--selected" : ""
                } `}
                key={pokemon}
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setInputValue(pokemon);
                  setActiveOption(index);
                }}
              >
                {pokemon}
              </li>
            );
          })
        ) : (
          <li>No Pokemon was found</li>
        )}
      </ul>
    </div>
  );
};
