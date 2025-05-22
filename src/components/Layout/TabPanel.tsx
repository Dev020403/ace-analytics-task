import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      role="region"
      hidden={value !== index}
      id={`panel-${index}`}
      aria-labelledby={`nav-button-${index}`}
      {...other}
    >
      {value === index && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: isMobile ? 0.2 : 0.3 }}
        >
          <Box 
            sx={{ 
              p: { xs: 1.5, sm: 2, md: 3 },
              overflow: 'auto',
              maxWidth: '100%',
            }}
          >
            {children}
          </Box>
        </motion.div>
      )}
    </div>
  );
};

export default TabPanel;