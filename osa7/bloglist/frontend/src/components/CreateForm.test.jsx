import { render, screen } from "@testing-library/react";

import CreateForm from "./CreateForm";
import userEvent from "@testing-library/user-event";

describe("<CreateForm/>", () => {
  test("submitting form calls callback function with right arguments", async () => {
    const createBlog = vi.fn();

    render(<CreateForm handlePost={createBlog} />);

    const titleInput = screen.getByPlaceholderText("write title here");
    const authorInput = screen.getByPlaceholderText("write author here");
    const urlInput = screen.getByPlaceholderText("write url here");
    const submitButton = screen.getByText("create new blog");

    await userEvent.type(titleInput, "testing title");
    await userEvent.type(authorInput, "testing author");
    await userEvent.type(urlInput, "testing url");
    await userEvent.click(submitButton);

    const correctBlog = {
      title: "testing title",
      author: "testing author",
      url: "testing url",
    };

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual(correctBlog);
  });
});
