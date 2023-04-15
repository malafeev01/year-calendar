export const mockLocation = () => {
  const mockResponse = jest.fn();
  Object.defineProperty(window, "location", {
    value: {
      hash: {
        endsWith: mockResponse,
        includes: mockResponse,
        substring: mockResponse,
      },
      reload: mockResponse,
      assign: mockResponse,
      origin: "",
      pathname: "/",
    },
    writable: true,
  });

  return mockResponse;
};

export const mockMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

export const mockWindowHistory = () => {
  Object.defineProperty(window, "history", {
    value: {
      replaceState: jest.fn(),
    },
    writable: true,
  });
};
