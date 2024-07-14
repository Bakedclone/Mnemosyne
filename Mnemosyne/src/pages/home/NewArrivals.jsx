import React from "react";
import useFetch from "@/src/utils/useFetch";

const NewArrivals = () => {
  const { data, loading } = useFetch(
    `?q=subject:fiction&orderBy=newest&maxResults=5&startIndex=0`
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {data?.items?.map((book) => {
        const { title, authors, description, imageLinks, categories } =
          book.volumeInfo;
        return (
          <div
            key={book.id}
            className="flex flex-row pb-5  justify-start"
          >
            <div>
              {imageLinks?.thumbnail && (
                <img
                  src={imageLinks.thumbnail}
                  alt={title}
                  className="w-32 h-48 object-cover self-center pr-4"
                />
              )}
            </div>
            <div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            {authors && (
              <p className="text-md text-gray-700 mb-2">
                By: {authors.join(", ")}
              </p>
            )}
            {categories && (
              <p className="text-sm text-gray-500 mb-2">
                Genre: {categories.join(", ")}
              </p>
            )}
            {/* {description && (
              <p className="text-sm text-gray-600 mb-2">{description}</p>
            )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewArrivals;
