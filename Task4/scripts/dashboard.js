const courses = [
    {
        title: "Acceleration",
        subject: "Physics",
        grade: 7,
        extragrade: 2,
        units: 4,
        lessons: 18,
        topics: 24,
        classes: ["Mr. Franks Class B","Mr Franks Class A"],
        img: "./quantum screen assets/images/imageMask-1.svg",
        students: 60,
        startdate: "21-Jan-2020",
        enddate: "21-Aug-2020",
        favourite: true,
        indicators: [true , true , true , true],
        expired: false,
    },
    {
        title: "Displacement, Velocity and Speed",
        subject: "Physics",
        grade: 6,
        extragrade: 3,
        units: 2,
        lessons: 15,
        topics: 20,
        img: "./quantum screen assets/images/imageMask-2.svg",
        students: 60,
        startdate: "21-Jan-2020",
        enddate: "21-Aug-2020",
        favourite: true,
        indicators: [true , false , false , true],
        expired: false,
    },
    {
        title: "Introduction to Biology: Micro organisms and how they affec...",
        subject: "Biology",
        grade: 7,
        extragrade: 2,
        units: 4,
        lessons: 18,
        topics: 24,
        classes: ["Mr. Franks Class B","Mr Franks Class A"],
        img: "./quantum screen assets/images/imageMask-3.svg",
        students: 60,
        startdate: "",
        enddate: "",
        favourite: false,
        indicators: [true , false , false , true],
        expired: false,
    },
    {
        title: "Introduction to High School Mathematics",
        subject: "Physics",
        grade: 7,
        extragrade: 2,
        units: 4,
        lessons: 18,
        topics: 24,
        classes: ["Mr. Franks Class B","Mr Franks Class A"],
        img: "./quantum screen assets/images/imageMask.svg",
        students: 60,
        startdate: "21-Jan-2020",
        enddate: "21-Aug-2020",
        favourite: true,
        indicators: [true , true , true , true],
        expired: true,
    },
]

const container = document.getElementById("item-container");

const add_course = (course) => {
    let item = `<div class="item">
            <div class="item-content">
              <div class="item-image-container">
                <img
                  src="`+course.img+`"
                  alt="image mask 1"
                  class="item-image"
                />
              </div>
              <div class="item-title-container">
                <div class="item-icon-container">
                  <img
                    src="./quantum screen assets/icons/favourite.svg"
                    alt="favourite icon"
                    class="item-icon `;
                    item += !(course.favourite)?"inactive":" ";
                    item +=` "
                  />
                </div>
                <div class="item-title">`+course.title+`</div>
              </div>
              <div class="item-subject-container">
                <div class="item-subject">`+course.subject+`&ensp;|&ensp;</div>
                <div class="item-grade">
                  Grade&nbsp;`+course.grade.toString()+`
                  <div class="item-grade-addition">&nbsp;+`+course.extragrade.toString()+`</div>
                </div>
              </div>
              <div class="item-class-container">`;

              if(course.units){
              item += `<div class="item-class-num">
                  <div class="bold">`+course.units.toString()+`&nbsp;</div>
                  Units&nbsp;
                  <div class="bold">`+course.lessons.toString()+`&nbsp;</div>
                  Lessons&nbsp;
                  <div class="bold">`+course.topics.toString()+`&nbsp;</div>
                  Toppics&nbsp;
                </div>`
              }
                item += `<div class="item-selector">
                  <select
                    name="`+course.title+`"
                    id="`+course.title+`"
                    class="form-dropdown-select"
                  >`

                  if(course.classes ){
                        course.classes.forEach(e => {
                            item += `
                    <option value="`+e+`">`+e+`</option>`;                 
                    });
                    item +=`</select>
                </div>
                <div class="item-class-num">
                  `+course.students.toString()+`&nbsp;Students&nbsp;|&nbsp;`+course.startdate+`&nbsp;-&nbsp;`+course.enddate+`
                </div>`
                  }
                  else{
                    item+=`<option value="no option" class="inactive">`+"no classes"+`</option></select></div>`;
                  }
                    
                  item +=`
                </div>
            </div>
            <div class="item-indicators">
              <div class="item-icon `;
              item += !course.indicators[0]?"inactive":"";
               item+=`">
                <img
                  src="./quantum screen assets/icons/preview.svg"
                  alt="preview icon"
                />
              </div>
              <div class="item-icon `;
              item+= !course.indicators[1]?"inactive":"";
              item +=`">
                <img
                  src="./quantum screen assets/icons/manage course.svg"
                  alt="manage course icon"
                />
              </div>
              <div class="item-icon `;
              item+= !course.indicators[2]?"inactive":"";
              item +=`">
                <img
                  src="./quantum screen assets/icons/grade submissions.svg"
                  alt="grade submission icon"
                />
              </div>
              <div class="item-icon `;
              item+= !course.indicators[3]?"inactive":"";
              item +=`">
                <img
                  src="./quantum screen assets/icons/reports.svg"
                  alt="reports icon"
                />
              </div>
            </div>
          </div>`

          return item;
    
}

courses.forEach(course=>{
    container.innerHTML+=add_course(course);
})


