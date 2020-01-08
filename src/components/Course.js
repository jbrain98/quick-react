import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};
const days = ['M', 'Tu', 'W', 'Th', 'F'];
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;


// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBwbc5ldCBH7eFRVI_wcHG7srB5tHsKHb0",
    authDomain: "scheduling-app-e0e87.firebaseapp.com",
    databaseURL: "https://scheduling-app-e0e87.firebaseio.com",
    projectId: "scheduling-app-e0e87",
    storageBucket: "scheduling-app-e0e87.appspot.com",
    messagingSenderId: "526706062330",
    appId: "1:526706062330:web:179c1d65f280574f566a43"
  };
  
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const buttonColor = selected => (
    selected ? 'success' : null
)

const Course = ({ course, state, user }) => (
    <Button color={ buttonColor(state.selected.includes(course)) }
      onClick={ () => state.toggle(course) }
      onDoubleClick={ user ? () => moveCourse(course) : null }
      disabled={ hasConflict(course, state.selected) }
      >
      { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
    </Button>
);

const moveCourse = course => {
    const meets = prompt('Enter new meeting data, in this format:', course.meets);
    if (!meets) return;
    const {days} = timeParts(meets);
    if (days) saveCourse(course, meets); 
    else moveCourse(course);
};

const hasConflict = (course, selected) => (
    selected.some(selection => course !== selection && courseConflict(course, selection))
);

const getCourseTerm = course => (
    terms[course.id.charAt(0)]
  );
  
  const getCourseNumber = course => (
    course.id.slice(1, 4)
)

const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
      days,
      hours: {
        start: hh1 * 60 + mm1 * 1,
        end: hh2 * 60 + mm2 * 1
      }
    };
  };
  
  const saveCourse = (course, meets) => {
    db.child('courses').child(course.id).update({meets})
      .catch(error => alert(error));
  };

  const daysOverlap = (days1, days2) => ( 
    days.some(day => days1.includes(day) && days2.includes(day))
  );
  
  const hoursOverlap = (hours1, hours2) => (
    Math.max(hours1.start, hours2.start)
      < Math.min(hours1.end, hours2.end)
  );
  
  const timeConflict = (course1, course2) => (
    daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
  );
  
  const courseConflict = (course1, course2) => (
    course1 !== course2
    && getCourseTerm(course1) === getCourseTerm(course2)
    && timeConflict(course1, course2)
  );

export default Course;