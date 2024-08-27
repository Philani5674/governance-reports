// tag::router[]
window.addEventListener('load', () => {

    const app = $("#app")
  
    const router = new Router({
      mode:'hash',
      root:'frontend/home.html',
    });
  
  
      router.add('/Enterprise', async () => {
          const html = await renderQuizEnterprise();
            app.html(html);
          });

      router.add('/Accountability', async () => {
      const html = await renderQuizAccountability();
          app.html(html);
          });

      router.add('/Sustainability', async () => {
          const html = await renderQuizSustainability();
            app.html(html);
          });

      router.add('/Comformance', async () => {
          const html = await renderQuizConformance();
            app.html(html);
          });

      router.add('/CompleteData', async () => {
        const html = await CompleteDataShowCase();
          app.html(html);
        });
  
    router.addUriListener();
  
    $('a').on('click', (event) => {
      event.preventDefault();
      const target = $(event.target);
      const href = target.attr('href');
      const path = href.substring(href.lastIndexOf('/'));
      router.navigateTo(path);
    });
  
    router.navigateTo('/');
  });
  
  async function CompleteDataShowCase(){
    CompletePieChart()
    CompleteDataShowCaseLine()
  }
  
async function CompleteDataShowCaseLine(){
  try {
    // Fetch data from the JSON file
    const response = await fetch('/frontend/Assets/PastMonthsTotals.json'); // Update the path
    const jsonData = await response.json();
    let values = Object.values(jsonData.EnterprisePurpose)

    const canvasWidth = 400; 
    const canvasHeight = 200;

    const ctx = document.getElementById('myLineChart').getContext('2d');
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    const chart = new Chart(ctx, {
     type: "line",
      data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
    {
      data: Object.values(jsonData.EnterprisePurpose),
      label: `Enterprise Purpose`,
      borderColor: "#4059AD",
      fill: false
    },
    {
      data: Object.values(jsonData.AccountabilityForPerformance),
      label: `Accountability For Performance`,
      borderColor: "#6B9AC4",
      fill: false
    },
    {
      data: Object.values(jsonData.Sustainability),
      label: `Sustainability`,
      borderColor: "#97D8C4",
      fill: false
    },
    {
      data: Object.values(jsonData.Conformance),
      label: `Conformance`,
      borderColor: "#F4B942",
      fill: false
    }
  ]
},
options: {
  title: {
    display: true,
    text: `EnterprisePurpose throughout the year`
  }
}
    });

    // Hide the quiz container and show the graph container
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('myLineChart').style.display = 'block';
  } catch (error) {
    console.error('Error fetching or rendering chart:', error);
  }
}
  
async function renderQuizEnterprise() {
  try {
    const response = await fetch('/frontend/Assets/questions.json');
    const data = await response.json();

    const templateSource = document.getElementById('quiz-template').innerHTML;
   
    const template = Handlebars.compile(templateSource);
    const html = template({ questions: Object.values(data.EnterprisePurpose)});

    document.getElementById('quiz-container').innerHTML = html;
    document.getElementById("heading").innerHTML = "Enterprise Purpose questionnare";
  } catch (error) {
    console.error('Error loading data or rendering quiz:', error);
  }
      document.getElementById('quiz-form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Form submitted');
        const formData = getFormData();
       renderPieChart(formData);
       renderLineChartEnterprisePurpose(formData);
        this.reset();
      });
    
}

async function renderQuizConformance() {
    try {
        const response = await fetch('/frontend/Assets/questions.json');
        const data = await response.json();
    
        const templateSource = document.getElementById('quiz-template').innerHTML;

        const template = Handlebars.compile(templateSource);
        const html = template({ questions: Object.values(data.Conformance)});
    
        document.getElementById('quiz-container').innerHTML = html;
        document.getElementById("heading").innerHTML = "Conformance questionnare";
    } catch (error) {
        console.error('Error loading data or rendering quiz:', error);
    }
        document.getElementById('quiz-form').addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('Form submitted');
            const formData = getFormData();
            renderLineChartConformance(formData);
            renderPieChart(formData);
            this.reset();
        });
        
    }

    async function renderQuizSustainability() {
    try {
        const response = await fetch('/frontend/Assets/questions.json');
        const data = await response.json();
    
        const templateSource = document.getElementById('quiz-template').innerHTML;
        const template = Handlebars.compile(templateSource);
        const html = template({ questions: Object.values(data.Sustainability)});
    
        document.getElementById('quiz-container').innerHTML = html;
        document.getElementById("heading").innerHTML = "Sustainability questionnare";
    } catch (error) {
        console.error('Error loading data or rendering quiz:', error);
    }
        document.getElementById('quiz-form').addEventListener('submit', function (event) {
            event.preventDefault();
            console.log('Form submitted');
            const formData = getFormData();
           renderLineChartSustainability(formData);
           renderPieChart(formData);
            this.reset();
        });
        
    }
    function renderPieChart(formData) {
    const canvasId = 'myPieChart';
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
      console.error(`Canvas element with ID '${canvasId}' not found.`);
      return;
    }
  
    const totalQuestions = Object.keys(formData).length;
    const totalPoints = Object.values(formData).reduce((acc, value) => acc + parseInt(value || 0, 10), 0);
    const maxPossiblePoints = totalQuestions * 4; 
    const percentage = (totalPoints / maxPossiblePoints) * 100;
  
    const chartData = {
      labels: ['Effective', 'Ineffective'],
      datasets: [{
        data: [percentage, 100 - percentage],
        backgroundColor: ['#4059AD', '#F4B942'],
      }],
    };
  
    const chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Canvas context could not be retrieved.');
      return;
    }
  
    const chart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: chartOptions,
    });
  
    // Hide the quiz container and show the graph container
    document.getElementById('quiz-container').style.display = 'none';
    canvas.style.display = 'block';
  }
    async function renderQuizAccountability() {
        try {
          const response = await fetch('/frontend/Assets/questions.json');
          const data = await response.json();
      
          const templateSource = document.getElementById('quiz-template').innerHTML;
          const template = Handlebars.compile(templateSource);
          const html = template({ questions: Object.values(data.AccountabilityForPerformance)});
      
          document.getElementById('quiz-container').innerHTML = html;
          document.getElementById("heading").innerHTML = "Accountability questionnare";
        } catch (error) {
          console.error('Error loading data or rendering quiz:', error);
        }
            document.getElementById('quiz-form').addEventListener('submit', function (event) {
              event.preventDefault();
              console.log('Form submitted');
              const formData = getFormData();
              renderQuizAccountability(formData);
              renderPieChart(formData);
              this.reset();
            });
          
      }


function getFormData() {
  const formData = {};
  const questions = document.querySelectorAll('[name^="question"]');

  questions.forEach((question, index) => {
    const selectedValue = document.querySelector(`[name="question${index}"]:checked`);
    if (selectedValue) {
      formData[`question${index}`] = selectedValue.value;
    } else {
      isFormValid = false;
    }
  });


  return formData;
  }

  
  
  async function CompletePieChart(formData) {
    const canvasId = 'myPieChart';
    const canvas = document.getElementById(canvasId);
    
    const response = await fetch('/frontend/Assets/PastMonthsTotals.json');
      const jsonData = await response.json();
      let values = Object.values(jsonData)
  

  
    const chartData = {
      labels: ['Enterprise Purpose', 'Accountability For Performance','Sustainability','Conformance'],
      datasets: [{
        data: [Object.values(jsonData.EnterprisePurpose)[10],Object.values(jsonData.AccountabilityForPerformance)[10],Object.values(jsonData.Sustainability)[10],Object.values(jsonData.Conformance)[10]],
        backgroundColor: ['#4059AD', '#F4B942','#97D8C4','#EFF2F1'],
      }],
    };
  
    const chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Canvas context could not be retrieved.');
      return;
    }
  
    const chart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: chartOptions,
    });
  
    // Hide the quiz container and show the graph container
    document.getElementById('quiz-container').style.display = 'none';
    canvas.style.display = 'block';
  }
  


  async function renderLineChartEnterprisePurpose(formData) {
    try {
      // Fetch data from the JSON file
      const response = await fetch('/frontend/Assets/PastMonthsTotals.json'); // Update the path
      const jsonData = await response.json();
      let values = Object.values(jsonData.EnterprisePurpose)
      const totalQuestions = Object.keys(formData).length;
      const totalPoints = Object.values(formData).reduce((acc, value) => acc + parseInt(value || 0, 10), 0);
      const maxPossiblePoints = totalQuestions * 4; 
      const percentage = (totalPoints / maxPossiblePoints) * 100;
      values.pop()
      values.pop()
      values.push(percentage)
  
      const canvasWidth = 400; 
      const canvasHeight = 200;
  
      const ctx = document.getElementById('myLineChart').getContext('2d');
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;
  
      const chart = new Chart(ctx, {
       type: "line",
        data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
      {
        data: values,
        label: `Enterprise Purpose`,
        borderColor: "#4059AD",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: `EnterprisePurpose throughout the year`
    }
  }
      });
  
      // Hide the quiz container and show the graph container
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('myLineChart').style.display = 'block';
    } catch (error) {
      console.error('Error fetching or rendering chart:', error);
    }
  }

  async function renderLineChartAccountabilityForPerformance(formData) {
    try {
      // Fetch data from the JSON file
      const response = await fetch('/frontend/Assets/PastMonthsTotals.json'); // Update the path
      const jsonData = await response.json();
      let values = Object.values(jsonData.AccountabilityForPerformance)
      const totalQuestions = Object.keys(formData).length;
      const totalPoints = Object.values(formData).reduce((acc, value) => acc + parseInt(value || 0, 10), 0);
      const maxPossiblePoints = totalQuestions * 4; 
      const percentage = (totalPoints / maxPossiblePoints) * 100;
      values.pop()
      values.pop()
      values.push(percentage)
  
      const canvasWidth = 400; 
      const canvasHeight = 200;
  
      const ctx = document.getElementById('myLineChart').getContext('2d');
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;
  
      const chart = new Chart(ctx, {
       type: "line",
        data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
      {
        data: values,
        label: `Accountability For Performance`,
        borderColor: "#4059AD",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: `Accountability For Performance throughout the year`
    }
  }
      });
  
      // Hide the quiz container and show the graph container
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('myLineChart').style.display = 'block';
    } catch (error) {
      console.error('Error fetching or rendering chart:', error);
    }
  }

  async function renderLineChartSustainability(formData) {
    try {
      // Fetch data from the JSON file
      const response = await fetch('/frontend/Assets/PastMonthsTotals.json'); // Update the path
      const jsonData = await response.json();
      let values = Object.values(jsonData.Sustainability)
      const totalQuestions = Object.keys(formData).length;
      const totalPoints = Object.values(formData).reduce((acc, value) => acc + parseInt(value || 0, 10), 0);
      const maxPossiblePoints = totalQuestions * 4; 
      const percentage = (totalPoints / maxPossiblePoints) * 100;
      values.pop()
      values.pop()
      values.push(percentage)
  
      const canvasWidth = 400; 
      const canvasHeight = 200;
  
      const ctx = document.getElementById('myLineChart').getContext('2d');
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;
  
      const chart = new Chart(ctx, {
       type: "line",
        data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
      {
        data: values,
        label: `Sustainability`,
        borderColor: "#4059AD",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: `Sustainability throughout the year`
    }
  }
      });
  
      // Hide the quiz container and show the graph container
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('myLineChart').style.display = 'block';
    } catch (error) {
      console.error('Error fetching or rendering chart:', error);
    }
  }

  async function renderLineChartConformance(formData) {
    try {
      // Fetch data from the JSON file
      const response = await fetch('/frontend/Assets/PastMonthsTotals.json'); // Update the path
      const jsonData = await response.json();
      let values = Object.values(jsonData.Conformance)
      const totalQuestions = Object.keys(formData).length;
      const totalPoints = Object.values(formData).reduce((acc, value) => acc + parseInt(value || 0, 10), 0);
      const maxPossiblePoints = totalQuestions * 4; 
      const percentage = (totalPoints / maxPossiblePoints) * 100;
      values.pop()
      values.pop()
      values.push(percentage)
  
      const canvasWidth = 400; 
      const canvasHeight = 200;
  
      const ctx = document.getElementById('myLineChart').getContext('2d');
      ctx.canvas.width = canvasWidth;
      ctx.canvas.height = canvasHeight;
  
      const chart = new Chart(ctx, {
       type: "line",
        data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
      {
        data: values,
        label: `Conformance`,
        borderColor: "#4059AD",
        fill: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: `Conformance throughout the year`
    }
  }
      });
  
      // Hide the quiz container and show the graph container
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('myLineChart').style.display = 'block';
    } catch (error) {
      console.error('Error fetching or rendering chart:', error);
    }
  }