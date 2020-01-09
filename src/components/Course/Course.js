import React, { useState, useEffect } from 'react';
import "rbx/index.css";
import { Button } from "rbx";
import { hasConflict, getCourseTerm } from './times';

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const buttonColor = selected => (
  selected ? 'success' : null
)

const Course = ({ course, state, user, db }) => (
  <Button color={buttonColor(state.selected.includes(course))}
    onClick={() => state.toggle(course)}
    onDoubleClick={user ? () => moveCourse(course, db) : null}
    disabled={hasConflict(course, state.selected)}
  >
    {getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
  </Button>
);

const moveCourse = (course, db) => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const { days } = timeParts(meets);
  if (days) saveCourse(course, meets, db);
  else moveCourse(course);
};

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

const saveCourse = (course, meets, db) => {
  db.child('courses').child(course.id).update({ meets })
    .catch(error => alert(error));
};


export default Course;