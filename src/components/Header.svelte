<script>
</script>

<header>
	<nav class="nav">
		<div class="logo">
			<a href="/"> ironpark.github.io</a>
		</div>
		<ul id="menu">
			<li>
				<a href="/memos" title="Index">
					<span>/Memos</span>
				</a>
			</li>
			<li>
				<a href="/tools" title="Index">
					<span>/Tools</span>
				</a>
			</li>
		</ul>
	</nav>
</header>

<style lang="scss">
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-inline-start: auto;
		margin-inline-end: auto;
		padding: 25px 25px;
		max-width: 1350px;
	}

	#menu {
		list-style: none;
		word-break: keep-all;
		overflow-x: auto;
		white-space: nowrap;
		display: flex;
		margin: auto 10px;
		li {
			margin: 0 10px;
			a {
				text-decoration: none;
			}
		}
	}
	.logo {
		display: flex;
		margin: auto 10px;
		font-size: 24px;
		font-weight: 700;
		a {
			text-decoration: none;
		}
	}
</style>
