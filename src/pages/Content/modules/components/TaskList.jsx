import React from 'react';
import styled from 'styled-components';
import Task from './Task';
import PropTypes from 'prop-types'

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 0px 10px 0px;
  overflow-y: auto;
  max-height: 450px;
  padding: 0px 5px;
  padding-bottom: 5px;
`;

/*
const demoAssignment = {
  name: 'Demo Assignment',
  html_url: 'https://hcpss.instructure.com/',
  points_possible: '15.0',
  due_at: '2020-11-09T08:30:00-05:00',
  color: '#D41E00',
  course_name: 'Course Name',
  course_id: 12345,
};
*/

export default function TaskList({ assignments }) {
  assignments = assignments.filter((assignment) => {
    return assignment.submission.attempt === null;
  });
  return (
      <ListContainer>
          {assignments.map((assignment) => {
        return (<Task
            assignment={assignment}
            key={assignment.id}
                />);
      })}
      </ListContainer>
  );
}

TaskList.propTypes = {
  assignments: PropTypes.arrayOf(PropTypes.object).isRequired,
}