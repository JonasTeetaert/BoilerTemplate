<?php include 'inc/head.php' ?>

<body>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Styleguide</h1>
				<p>made by Jonas Teetaert</p>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Colors</h1>
				<style type="text/css">
					.colorblock {
						width: 50px;
						height: 50px;
					}

					.black {
						background-color: #000000;
					}

					.yellow {
						background-color: #FFBC27;
					}
				</style>
				<div class="colorblock black"></div>
				<p>color-primary: #000000</p>
				<div class="colorblock yellow"></div>
				<p>color-secondary: #FFBC27</p>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Headers</h1>
				<h1>H1. This is a h1 title</h1>
				<h2>H2. This is a h2 title</h2>
				<h3>H3. This is a h3 title</h3>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Paragraph en links</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis mattis tellus iaculis viverra. Nunc auctor dolor
					orci, a interdum purus facilisis id. Etiam dolor nulla, dignissim et nunc sit amet, tristique bibendum dui. Nunc ultricies
					tellus et est ornare, non viverra felis commodo. Vivamus pharetra ultricies sollicitudin.
					<a href="#">Link</a> Cras congue mattis ante, maximus vehicula urna posuere id. Curabitur eleifend aliquet porttitor. Etiam pretium
					risus in dictum malesuada. Donec et mollis orci, a sollicitudin leo. Praesent eget erat purus.</p>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Buttons</h1>
				<p>
					<a class="btn" href="#">about</a>
				</p>
				<p>
					<a class="btn btn--firstletter" href="#">Jonas Teetaert</a>
				</p>
				<p>
					<a class="btn btn--shadow" href="#">Jonas Teetaert</a>
				</p>
				<div class="">
					<input class="toggle" id="about" type="checkbox">
					<label class="toggle--label btn" for="about" data-on="close" data-off="about"></label>
				</div>
			</div>
		</div>
	</section>
	<section class="section">
		<div class="section__inner">
			<div class="content-box">
				<h1>Icon</h1>
				<p>
					<a class="btn btn--shadow" href="#">
						<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.28 101.28">
							<defs>
								<style>
									.a {
										fill: #ffbc27;
									}
								</style>
							</defs>
							<title>portfolio_icon</title>
							<polygon class="a" points="67.52 67.52 67.52 101.28 0 101.28 0 0 33.76 0 33.76 67.52 67.52 67.52" />
							<polygon points="101.28 0 101.28 101.28 67.52 101.28 67.52 33.76 33.76 33.76 33.76 0 101.28 0" />
						</svg>Jonas Teetaert</a>
				</p>
			</div>
		</div>
	</section>

	<script type="text/javascript" src="js/main.js"></script>
</body>

</html>