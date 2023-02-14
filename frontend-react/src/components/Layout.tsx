import { Container, Box } from "@mui/system";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          color: "white",
          mt: 4,
          mb: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}