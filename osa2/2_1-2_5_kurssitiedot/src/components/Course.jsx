const Header = (props) => {
    return (
      <h2>{props.course}</h2>
    )
  }
  
  const Part = (props) => {
    return (
      <p>{props.part.name} {props.part.exercises}</p>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part =>
        <Part key={part.id} part={part} /> 
        )}
      </div>
    )
  }
  
  
  const Total = ({parts}) => {
    const total = parts.reduce((total, {exercises}) => total + exercises, 0)
    return (
      <p><b>Total of exercises {total}</b></p>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
      </div>
    )
  }


export default Course