import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

const Menu = () => {
  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
    },
    grow: {
      flexGrow: 1,
      float: "right",
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow} display={{ flexGrow: 1 }}>
            <Typography variant="h6" color="inherit" noWrap>
              Detail View
            </Typography>
            <IconButton color="secondary" onClick={""}>
              Preview JSON <Delete />
            </IconButton>
            <IconButton color="secondary" onClick={""}>
              Preview Template <Delete />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Menu;
