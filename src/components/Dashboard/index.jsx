import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import WeatherIcon from "@mui/icons-material/WbSunny";
import CalendarIcon from "@mui/icons-material/EventNote";
import Badge from "@mui/material/Badge";
import { format } from "date-fns";

import WeatherPic from "../../assets/weather.jpg";
import KanbanPic from "../../assets/people-working.avif";
import CalendarPic from "../../assets/calendar.avif";

const cardMediaStyle = {
  height: 160,
  objectPosition: "center 40%",
};

const DashboardCard = () => {
  const currentDate = new Date();
  const user = useSelector((state) => state.user.user);

  if (!user) {
    window.location.href = "/";
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "auto 1fr",
        gap: 16,
      }}
    >
      <Card
        style={{ gridRow: "1 / 2", gridColumn: "1 / 4" }}
        variant="outlined"
        elevation={0}
      >
        <CardContent>
          {user ? (
            <>
              <Typography
                variant="h5"
                color="primary"
                align="center"
                gutterBottom
              >
                Welcome, {user.username}!
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                You're logged in as <b>{user.role.name}</b>.
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                {user.email}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h5"
              color="primary"
              align="center"
              gutterBottom
            >
              Please wait...
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          color="primary"
          style={cardMediaStyle}
          image={WeatherPic}
          alt="weather"
        />
        <CardContent>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            <WeatherIcon /> Weather
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
              Cloudy
            </span>
            <br />
            <span style={{ fontSize: "1.2em" }}>Semarang, Central Java</span>
            <br />
            <span style={{ fontSize: "1.2em" }}>Indonesia</span>
            <br />
            <span style={{ fontSize: "1.2em" }}>26°C</span>
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          style={cardMediaStyle}
          image={CalendarPic}
          alt="calendar"
        />
        <CardContent>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            <CalendarIcon />
            Calendar
          </Typography>
          <h2>{format(currentDate, "EEEE, MMMM d, y")}</h2>
        </CardContent>
      </Card>

      <Card variant="outlined" elevation={0}>
        <CardMedia
          component="img"
          style={cardMediaStyle}
          image={KanbanPic}
          alt="people-working"
        />
        <CardContent>
          <Typography variant="h5" color="primary" align="center" gutterBottom>
            Folklof App
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            The Story Teller Platform as an Innovative Educational Tool to
            Support the SDGs
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
