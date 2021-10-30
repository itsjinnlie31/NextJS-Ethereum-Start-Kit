import React from "react";
import "jest-canvas-mock";
import renderer from "react-test-renderer";
import HomeIndex from "../../pages/index";

it("renders index page", () => {
	const useRouter = jest.spyOn(require("next/router"), "useRouter");
	useRouter.mockImplementationOnce(() => ({
		asPath: "",
	}));

	const tree = renderer.create(<HomeIndex />).toJSON();

	expect(tree).toMatchSnapshot();
});
