@section('user-panel')

    {{ Form::open('login') }}

    {{ Form::label('club_number', 'Club Number:') }}
    {{ Form::text('club_number') }}

    {{ Form::label('password', 'Password:') }}
    {{ Form::password('password') }} <br />

    {{ Form::submit('Login') }}

    {{ Form::close() }}

@endsection