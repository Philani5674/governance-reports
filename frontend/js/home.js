async function CompletePieChart(formData) {
    const canvasId = 'myPieChart';
    const canvas = document.getElementById(canvasId);

    const response = await fetch('/Assets/PastMonthsTotals.json');
    const jsonData = await response.json();
    let values = Object.values(jsonData)



    const chartData = {
        labels: ['Enterprise Purpose', 'Accountability For Performance', 'Sustainability', 'Conformance'],
        datasets: [{
            data: [Object.values(jsonData.EnterprisePurpose)[10], Object.values(jsonData.AccountabilityForPerformance)[10], Object.values(jsonData.Sustainability)[10], Object.values(jsonData.Conformance)[10]],
            backgroundColor: ['#4059AD', '#F4B942', '#97D8C4', '#EFF2F1'],
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
        const response = await fetch('/Assets/PastMonthsTotals.json'); // Update the path
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
                datasets: [{
                    data: values,
                    label: `Enterprise Purpose`,
                    borderColor: "#4059AD",
                    fill: false
                }]
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