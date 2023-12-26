import { render, screen } from "@testing-library/react";

import { Select } from "../Select";
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

      const textBox = screen.getByRole("combobox", {
        name: /select pokemons/i,
      });

      await user.click(textBox);

      expect(screen.getByRole("listbox")).toBeVisible();
    });
  });

  describe("Typing on the combobox", () => {
    test("If none option is found, it shows a disabled fallback option", async () => {
      const user = userEvent.setup();
      render(<Select />);

      const textBox = screen.getByRole("combobox", {
        name: /select pokemons/i,
      });

      await user.type(textBox, "Agumon");

      expect(screen.getByText("No Pokemon was found")).toBeInTheDocument();
    });

    test("When typing show filtered options matching the value", async () => {
      const user = userEvent.setup();
      render(<Select />);

      const textBox = screen.getByRole("combobox", {
        name: /select pokemons/i,
      });
      await user.type(textBox, "Char");

      const options = screen.getAllByRole("option");

      expect(options).toHaveLength(3);

      expect(
        screen.getByRole("option", { name: /charmander/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /charmeleon/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /charizard/i })
      ).toBeInTheDocument();
    });
  });

  // 17 tests falhando - 6 passando
  // 13 tests falhando - 10 passando
  // 12 tests falhando - 11 passando
  // 11 tests falhando - 12 passando
  // 10 tests falhando - 13 passando
  // 8 tests falhando - 15 passando
  describe("Keyboard Support", () => {
    describe("Textbox", () => {
      describe("Down Arrow", () => {
        test("If the textbox is empty and the listbox is not displayed, opens the listbox and moves visual focus to the first option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");

          expect(screen.getByRole("listbox")).toBeVisible();
          expect(
            screen.getByRole("option", { name: /bulbasaur/i })
          ).toHaveAttribute("aria-selected", "true");
        });

        test("If the textbox is not empty and the listbox is displayed, moves visual focus to the first suggested value.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.type(screen.getByRole("combobox"), "Char");
          await user.keyboard("{ArrowDown}");

          expect(
            screen.getByRole("option", { name: /charmander/i })
          ).toHaveAttribute("aria-selected", "true");
        });

        test("DOM focus remains on the textbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");

          expect(screen.getByRole("combobox")).toHaveFocus();
        });
      });

      describe("Alt + Down Arrow", () => {
        test("Opens the listbox without moving focus or changing selection.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

          expect(screen.getByRole("combobox")).toHaveFocus();

          expect(screen.getByRole("listbox")).toBeVisible();

          expect(
            screen.getByRole("option", { name: /bulbasaur/i })
          ).not.toHaveAttribute("aria-selected", "true");
        });
      });

      describe("Up Arrow", () => {
        test("If the textbox is empty, first opens the listbox if it is not already displayed and then moves visual focus to the last option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowUp}");

          expect(screen.getByRole("listbox")).toBeVisible();

          expect(screen.getByRole("option", { name: "Mew" })).toHaveAttribute(
            "aria-selected",
            "true"
          );
        });
        test("If the textbox is not empty and the listbox is displayed, moves visual focus to the last suggested value.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.type(screen.getByRole("combobox"), "Char");
          await user.keyboard("{ArrowUp}");

          expect(
            screen.getByRole("option", { name: /charizard/i })
          ).toHaveAttribute("aria-selected", "true");
        });
        test("DOM focus remains on the textbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowUp}");

          expect(screen.getByRole("combobox")).toHaveFocus();
        });
      });

      describe("Enter", () => {
        test("Closes the listbox if it is displayed.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowUp}");
          await user.keyboard("{Enter}");

          expect(
            screen.getByRole("listbox", { hidden: true })
          ).not.toBeVisible();
        });
      });

      describe("Escape", () => {
        test("If the listbox is displayed, closes it.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{Escape}");

          expect(
            screen.getByRole("listbox", { hidden: true })
          ).not.toBeVisible();
        });
        test("If the listbox is not displayed, clears the textbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.type(screen.getByRole("combobox"), "Char", {
            skipClick: true,
          });

          await user.keyboard("{Escape}");

          expect(screen.getByRole("combobox")).toHaveValue("");
        });
      });
    });

    describe("Listbox Popup", () => {
      describe("Enter", () => {
        test("Sets the textbox value to the content of the focused option in the listbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.type(screen.getByRole("combobox"), "Char");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{Enter}");

          expect(screen.getByRole("combobox")).toHaveValue("Charmander");
        });
      });

      describe("Tab", () => {
        test("Sets the textbox value to the content of the focused option in the listbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.type(screen.getByRole("combobox"), "Char");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{Tab}");

          expect(screen.getByRole("combobox")).toHaveValue("Charmander");
        });
        test("Closes the listbox and unfocus the listbox and textbox.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.type(screen.getByRole("combobox"), "Char");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{Tab}");

          expect(
            screen.getByRole("listbox", { hidden: true })
          ).not.toBeVisible();
          expect(screen.getByRole("combobox")).not.toHaveFocus();
        });
      });

      describe("Down Arrow", () => {
        test("Moves visual focus to the next option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{ArrowDown}");

          expect(
            screen.getByRole("option", { name: /ivysaur/i })
          ).toHaveAttribute("aria-selected", "true");
        });
        test("If visual focus is on the last option, moves visual focus to the first option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowUp}");
          await user.keyboard("{ArrowDown}");

          expect(
            screen.getByRole("option", { name: /bulbasaur/i })
          ).toHaveAttribute("aria-selected", "true");
        });
      });

      describe("Up Arrow", () => {
        test("Moves visual focus to the previous option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{ArrowUp}");

          expect(
            screen.getByRole("option", { name: /bulbasaur/i })
          ).toHaveAttribute("aria-selected", "true");
        });
        test("If visual focus is on the first option, moves visual focus to the last option.", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{ArrowUp}");

          expect(screen.getByRole("option", { name: /mew/i })).toHaveAttribute(
            "aria-selected",
            "true"
          );
        });
      });

      describe("Home", () => {
        test("Moves visual focus to the textbox", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{Home}");

          const options = screen.getAllByRole("option");

          options.forEach((option) => {
            expect(option).toHaveAttribute("aria-selected", "false");
          });
        });
      });

      describe("End", () => {
        test("Moves visual focus to the textbox", async () => {
          const user = userEvent.setup();
          render(<Select />);

          await user.keyboard("{Tab}");
          await user.keyboard("{ArrowDown}");
          await user.keyboard("{End}");

          const options = screen.getAllByRole("option");

          options.forEach((option) => {
            expect(option).toHaveAttribute("aria-selected", "false");
          });
        });
      });
    });
  });
});
