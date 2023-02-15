import * as React from "react";
import { useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDomainContext } from "../../hooks/useDomainContext";
import styles from "../../styles/Home.module.css";
import { ListItemSecondaryAction } from "@mui/material";

const Demo = styled("div")(({ theme }) => ({
  border: "1px solid #bf9e7b",
  borderRadius: "5px",
}));

export default function DomainList() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const { domainList, setDomainList } = useDomainContext();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    // onSetDomain(domainList[index]);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 752,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Demo>
            <List>
              {domainList.map((domain: Domain, index: number) => (
                <ListItem
                  key={index}
                  selected={selectedIndex === index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setDomainList(
                          domainList.filter((_domain) => _domain !== domain)
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemText
                      primary={domain.name + ".stark"}
                      secondary={domain.duration + "years"}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}
