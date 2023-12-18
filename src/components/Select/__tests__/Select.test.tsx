import { Select } from "../Select";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Select", () => {
  test("Renders the Select", () => {
    render(<Select />);

    expect(screen.getByLabelText("Select Pokemons")).toBeInTheDocument();
  });

  describe("Mouse Interactions", () => {
    test("When the text input is clicked, opens the listbox", async () => {
      const user = userEvent.setup();
      render(<Select />);

      const textBox = screen.getByRole("combobox", { name: "Select Pokemons" });

      await user.click(textBox);

      expect(screen.getByRole("listbox")).toBeVisible();
    });
  });

  describe("Typing on the combobox", () => {
    test("If none option is found, it shows a disabled fallback option", async () => {
      const user = userEvent.setup();
      render(<Select />);

      const textBox = screen.getByRole("combobox", { name: "Select Pokemons" });

      await user.type(textBox, "Agumon");

      expect(screen.getByText("No Pokemon was found")).toBeInTheDocument();
    });

    test("When typing show filtered options matching the value", async () => {
      const user = userEvent.setup();
      render(<Select />);

      const textBox = screen.getByRole("combobox", { name: "Select Pokemons" });
      await user.type(textBox, "Char");

      const options = screen.getAllByRole("option");

      expect(options).toHaveLength(3);

      expect(
        screen.getByRole("option", { name: "Charmander" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Charmeleon" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Charizard" })
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Support", () => {
    describe("Textbox", () => {
      describe("Down Arrow", () => {
        test("If the textbox is not empty and the listbox is displayed, moves visual focus to the first suggested value.", () => {});
        test("If the textbox is empty and the listbox is not displayed, opens the listbox and moves visual focus to the first option.", () => {});
        test("DOM focus remains on the textbox.", () => {});
      });

      describe("Alt + Down Arrow", () => {
        test("Opens the listbox without moving focus or changing selection.", () => {});
      });

      describe("Up Arrow", () => {
        test("If the textbox is not empty and the listbox is displayed, moves visual focus to the last suggested value.", () => {});
        test("If the textbox is empty, first opens the listbox if it is not already displayed and then moves visual focus to the last option.", () => {});
        test("DOM focus remains on the textbox.", () => {});
      });

      describe("Enter", () => {
        test("Closes the listbox if it is displayed.", () => {});
      });

      describe("Escape", () => {
        test("If the listbox is displayed, closes it.", () => {});
        test("If the listbox is not displayed, clears the textbox.", () => {});
      });
    });

    describe("Listbox Popup", () => {
      describe("Enter", () => {
        test("Sets the textbox value to the content of the focused option in the listbox.", () => {});
      });

      describe("Tab", () => {
        test("Sets the textbox value to the content of the focused option in the listbox.", () => {});
        test("Closes the listbox and unfocus the listbox and textbox.", () => {});
      });

      describe("Down Arrow", () => {
        test("Moves visual focus to the next option.", () => {});
        test("If visual focus is on the last option, moves visual focus to the first option.", () => {});
      });

      describe("Up Arrow", () => {
        test("Moves visual focus to the previous option.", () => {});
        test("If visual focus is on the first option, moves visual focus to the last option.", () => {});
      });

      describe("Home", () => {
        test("Moves visual focus to the textbox and places the editing cursor at the beginning of the field.", () => {});
      });

      describe("End", () => {
        test("Moves visual focus to the textbox and places the editing cursor at the end of the field.", () => {});
      });
    });
  });
});
