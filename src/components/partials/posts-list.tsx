import React from "react";

const PostsList: React.FC = () => {
  return (
    <ul className="flex flex-col gap-2 p-2">
      {new Array(50).fill(0).map((_, i) => (
        <li
          key={i}
          className="rounded-lg bg-primary-foreground bg-opacity-10 p-2">
          {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </li>
      ))}
    </ul>
  );
};

export default PostsList;
