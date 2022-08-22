import About from "../About";
import {render,screen} from "@testing-library/react";
import '@testing-library/jest-dom'

describe("About", () => {
    it("renders About component", () => {
        render(<About />);
        expect(screen.getByText(/made by Vladyslav Lisovyi/i)).toBeInTheDocument();
        // @ts-ignore
        expect(screen.getByText(/GitHub/i).href).toEqual('https://github.com/babub22')
        expect(screen.getByTestId(/GitHubIcon/i)).toBeInTheDocument();
    });
});