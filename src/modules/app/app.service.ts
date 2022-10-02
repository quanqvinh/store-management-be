import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getHello() {
		return `
			<style>
				html {
					background-color: #390f27;
					font-size: 10px;
				}
				body {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
					margin: 0;
					overflow: hidden;
				}
				.gif {
					height: 60%;
					background-image: url(funny_thanos.gif);
					background-size: contain;
					background-position: bottom;
					background-repeat: no-repeat;
					background-color: #390f27;
				}
				.popout {
					max-height: 40%;
					font-family: Futura, sans-serif;
					font-weight: 900;
					font-size: 8rem;
					padding: 8rem 8rem 0;
					text-align: center;
					margin: 0;
				}
				.popout a {
					text-decoration: none;
				}
				@keyframes ani {
					0% {
						transform: translate3d(0, 0, 0);
						text-shadow: 0em 0em 0 rgba(0 0 0 / 80%);
				}
					30% {
						transform: translate3d(0, 0, 0);
						text-shadow: 0em 0em 0 rgba(0 0 0 / 70%);
				}
					70% {
						transform: translate3d(0.08em, -0.08em, 0);
						text-shadow: -0.08em 0.08em rgba(0 0 0 / 60%);
				}
					100% {
						transform: translate3d(0.08em, -0.08em, 0);
						text-shadow: -0.08em 0.08em rgba(0 0 0 / 55%);
				}
				}
				.popout span {
					position: relative;
					display: inline-block;
					animation: ani 1s infinite alternate cubic-bezier(0.86, 0, 0.07, 1);
				}
				.popout > span {
					color: rgb(255 152 0) !important;
				}
				.popout span:nth-last-child(1n) {
					animation-delay: -0.1666666667s;
				}
				.popout span:nth-last-child(2n) {
					animation-delay: -0.3333333333s;
				}
				.popout span:nth-last-child(3n) {
					animation-delay: -0.5s;
				}
				.highlight {
					color: #7d3d7d !important;
				}
			</style>
			<p class="popout">
				<a href="https://thanos-dev-api.herokuapp.com">
					<span class="highlight">T</span>
					<span class="highlight">H</span>
					<span class="highlight">A</span>
					<span class="highlight">N</span>
					<span class="highlight">O</span>
					<span class="highlight">S</span><br>
				</a>
				<span>A</span>
				<span>P</span>
				<span>I</span>&nbsp;
				<span>S</span>
				<span>E</span>
				<span>R</span>
				<span>V</span>
				<span>E</span>
				<span>R</span>
			</p>
			<div class="gif"></div>
		`
	}
}
