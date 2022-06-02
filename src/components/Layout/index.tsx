import { Box, Grommet, Heading } from "grommet";
import React from "react";

import { Theme } from "../../theme";

const Layout = ({ children, prompt }) => {
  return (
    <Grommet theme={Theme}>
      <Box direction="column" align="center" gap="small" fill>
        <Heading>{prompt}</Heading>
        {children}
      </Box>
    </Grommet>
  );
};

export default Layout;
