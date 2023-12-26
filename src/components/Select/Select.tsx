import "./Select.css";

import { POKEMONS } from "./constants";
import { useState } from "react";
import { Option } from "./Option";

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
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            setShowDropdown(true);

            if (!e.altKey) {
              setActiveOption((oldOption) => {
                const nextOption = oldOption + 1;

                if (nextOption >= filteredOptions.length) {
                  return 0;
                }
                return nextOption;
              });
            }
          }

          if (e.key === "ArrowUp") {
            setShowDropdown(true);
            setActiveOption(filteredOptions.length - 1);
          }

          if (e.key === "Enter") {
            if (activeOption !== NO_OPTION_SELECTED && showDropdown) {
              setInputValue(filteredOptions[activeOption]);
            }

            setShowDropdown(false);
          }

          if (e.key === "Tab") {
            if (activeOption !== NO_OPTION_SELECTED && showDropdown) {
              setInputValue(filteredOptions[activeOption]);
            }

            setShowDropdown(false);
          }

          if (e.key === "Escape") {
            if (showDropdown) {
              setShowDropdown(false);
            } else {
              setInputValue("");
            }
          }
        }}
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
              <Option
                key={pokemon}
                selected={selected}
                onClick={() => {
                  setInputValue(pokemon);
                  setActiveOption(index);
                }}
              >
                {pokemon}
              </Option>
            );
          })
        ) : (
          <li>No Pokemon was found</li>
        )}
      </ul>
    </div>
  );
};
