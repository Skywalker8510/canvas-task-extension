import React, { useEffect, useMemo, useState } from 'react';
import CourseDropdown from '../course-dropdown';
import TaskChart from '../task-chart';
import TaskList from '../task-list';
import { Course, FinalAssignment, Options } from '../../types';
import extractCourses from './utils/extractCourses';
import { filterCourses, filterTimeBounds } from '../../hooks/useAssignments';
import markAssignment from './utils/markAssignment';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  courseId?: number | false;
  courseList?: Course[]; // all courses, for corner case when on course page w/ no assignments
  options: Options;
  startDate?: Date;
  endDate?: Date;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  assignments,
  courseId,
  courseList,
  loading,
  options,
  startDate,
  endDate,
}: TaskContainerProps): JSX.Element {
  const [selectedCourseId, setSelectedCourseId] = useState<number>(
    courseList && courseId ? courseId : -1
  );

  // update assignments in state when marked as complete, then push updates asynchronously to local storage
  const [updatedAssignments, setUpdatedAssignments] =
    useState<FinalAssignment[]>(assignments);

  const courses = useMemo(() => {
    if (courseList && courseId !== false)
      return courseList.filter((c) => c.id === courseId);
    return extractCourses(updatedAssignments);
  }, [updatedAssignments, courseId]);

  async function markAssignmentAs(id: number, status: boolean) {
    const newAssignments = updatedAssignments.map((a) => {
      if (a.id == id) return markAssignment(status, a);
      return a;
    });
    setUpdatedAssignments(newAssignments);
  }

  async function createNewAssignment(assignment: FinalAssignment) {
    if (startDate && endDate) {
      const withinBounds = filterTimeBounds(startDate, endDate, [assignment]);
      if (withinBounds.length) {
        const newAssignments = updatedAssignments.concat(withinBounds);
        setUpdatedAssignments(newAssignments);
      }
    }
  }

  // Don't let user switch courses when on a course page
  const chosenCourseId = courseId ? courseId : selectedCourseId;

  useEffect(() => {
    if (courseId && courseId !== -1)
      setUpdatedAssignments(filterCourses([courseId], assignments));
    else setUpdatedAssignments(assignments);
  }, [assignments, courseId]);

  return (
    <>
      <CourseDropdown
        courses={courses}
        onCoursePage={!!courseId}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskChart
        assignments={updatedAssignments}
        colorOverride={
          courseId && courseId !== -1 ? courses[0].color : undefined
        }
        loading={loading}
        onCoursePage={!!courseId}
        selectedCourseId={chosenCourseId}
        setCourse={setSelectedCourseId}
      />
      <TaskList
        assignments={updatedAssignments}
        createAssignment={createNewAssignment}
        markAssignment={markAssignmentAs}
        selectedCourseId={chosenCourseId}
        showDateHeadings={options.due_date_headings}
      />
    </>
  );
}