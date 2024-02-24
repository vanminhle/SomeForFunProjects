const authorization = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTFkZTEyZjUwNmJlNjhlNmI2Y2UzNWJlODZmNDViYSIsInN1YiI6IjY1Y2EyMTZiOGQ3N2M0MDE2MjQ2ZDhlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kFcbY0voy6CqIQ_9o2g00TzTlS6naDretRqhLHWdMks'
	}
};

export async function load({ fetch }) {
	const res = await fetch(
		'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
		authorization
	);
	const data = await res.json();

	if (res.ok) {
		return {
			popular: data.results
		};
	}
}
