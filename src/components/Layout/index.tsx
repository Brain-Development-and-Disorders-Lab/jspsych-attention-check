import { Box, Grommet, Heading } from 'grommet';
import React from 'react';

const Layout = ({ children, prompt }) => {
  return (
    <Grommet>
      <Box direction="column" align="center" fill>
        <Heading>{prompt}</Heading>
        {children}
      </Box>
    </Grommet>
  );
}

export default Layout;