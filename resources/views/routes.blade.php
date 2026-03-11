<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.1.2/tailwind.min.css"
          crossorigin="anonymous">

    <style>
        body {
            font-family: 'Nunito', sans-serif;
        }
    </style>
    <style type="text/css">
        .table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, .015);
        }

        .table td, .table th {
            border-bottom: 1px solid #eee;
            font-size: 14px;
            padding: 10px 0;
        }

        .table thead th {
            border-bottom: 1px solid #eee;
        }

        .text-warning {
            color: #ff5722 !important;
        }

        .tag {
            padding: 0.30em 0.8em;
        }

        table.hide-domains .domain {
            display: none;
        }
    </style>
</head>
<body class="antialiased">

<h2 class="font-semibold text-xl text-gray-800 leading-tight">
    Routes ({{ count($routes) }})
</h2>


<div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">

            <div class="container mt-10 md-10 pb-5">
                <table class="table table-sm table-hover" style="width: 100%; word-wrap:break-word;
              table-layout: fixed;visibility: hidden;">
                    <thead>
                    <tr>
                        <th width="7%">Methods</th>

                        <th width="20%">Path</th>
                        <th width="15%">Name</th>
                        <th width="30%">Action</th>
                        <th width="15%">Middleware</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php $methodColours = ['GET' => 'green', 'HEAD' => 'purple', 'OPTIONS' => 'brown', 'POST' => 'blue', 'PUT' => 'yellow', 'PATCH' => 'gray', 'DELETE' => 'red']; ?>
                    @foreach ($routes as $route)
                        <tr>
                            <td>
                                @foreach (array_diff($route->methods(), ['HEAD']) as $method)
                                    <span
                                        class="inline-flex items-center justify-center mx-3 px-2 py-1 text-xs font-bold leading-none bg-{{ $methodColours[$method] }}-200 rounded-full ">{{ $method }}</span>
                                @endforeach
                            </td>
                            <td>
                                <a href="{{ url($route->uri()) }}">{!! preg_replace('#({[^}]+})#', '<span class="text-warning">$1</span>', $route->uri()) !!}</a>
                            </td>
                            <td>{{ $route->getName() }}</td>
                            <td>{!! preg_replace('#(@.*)$#', '<span class="text-warning">$1</span>', $route->getActionName()) !!}</td>
                            <td>
                                @if (is_callable([$route, 'controllerMiddleware']))
                                    {{ implode(', ', array_map($middlewareClosure, array_merge($route->middleware(), $route->controllerMiddleware()))) }}
                                @else
                                    {{ implode(', ', $route->middleware()) }}
                                @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script src="{{ asset('js/app.js') }}"></script>


<script>
    Echo.channel('chat-room')
        .listen('ChatStoreEvent', (e) => {
            console.log(e.message);
        })
</script>
<script type="text/javascript">
    function hideEmptyDomainColumn() {
        var table = document.querySelector('.table');
        var domains = table.querySelectorAll('tbody .domain');
        var emptyDomains = table.querySelectorAll('tbody .domain-empty');
        if (domains.length == emptyDomains.length) {
            table.className += ' hide-domains';
        }
        table.style.visibility = 'visible';
    }

    hideEmptyDomainColumn();


</script>

</body>
<script>
</script>
</html>
