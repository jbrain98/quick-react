import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title } from "rbx";
import Course from './Course';

const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};
const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;
const CourseList = ({ courses, user, db}) => {
    const [term, setTerm] = useState('Fall');
    const [selected, toggle] = useSelection();
    const termCourses = courses.filter(course => term === getCourseTerm(course));
    
    return (
      <React.Fragment>
        <TermSelector state={ { term, setTerm } } />
        <Button.Group>
          { termCourses.map(course =>
             <Course key={ course.id } course={ course }
               state={ { selected, toggle } }
               user={ user } 
               db={ db }/>) }
        </Button.Group>
      </React.Fragment>
    );
  };

    
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

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});


const useSelection = () => {
    const [selected, setSelected] = useState([]);
    const toggle = (x) => {
      setSelected(selected.includes(x) ? selected.filter(y => y !== x) : [x].concat(selected))
    };
    return [ selected, toggle ];
  };

const buttonColor = selected => (
    selected ? 'success' : null
)

const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);

const TermSelector = ({ state }) => (
    <Button.Group hasAddons>
      { Object.values(terms)
          .map(value => 
            <Button key={value}
              color={ buttonColor(value === state.term) }
              onClick={ () => state.setTerm(value) }
              >
              { value }
            </Button>
          )
      }
    </Button.Group>
 );

 export default CourseList;