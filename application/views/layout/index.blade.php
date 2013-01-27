<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        {{ Asset::styles() }}

        <title>Toast Masters Tools</title>
    </head>
    <body>
        <div id="page">
            <header id="header">
                <span class="title">Toastmasters Tools</span>
                <nav class="nav">
                    <ul>
                        <li>{{ HTML::link('tools/members', 'Member List') }}</li>
                        <li>{{ HTML::link('tools/quorum', 'Quorum Calculator') }}</li>
                        <li>{{ HTML::link('tools/weeks', 'Weeks Since Last Speech') }}</li>
                    </ul>
                </nav>
            </header>

            <aside id="user">
                @yield('user-panel')
            </aside>

            <section id="main">
                <h1>@yield('page-name')</h1>
                @yield('content')
            </section>

            <div class="clear"></div>

            <footer id="footer">Andrew Judd &copy; 2013 All rights reserved</footer>
        </div>

        {{ Asset::scripts() }}
    </body>
</html>
