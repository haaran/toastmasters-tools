<?php

class Base_Controller extends Controller
{

    public $layout = 'layout/index';

    public function __construct()
    {
        Asset::add('reset', 'css/reset.css');
        Asset::add('style', 'css/style.css');

        // Third party styles
        Asset::add('slick-css', 'css/slick.grid.css');

        // Third party libraries
        Asset::add('jquery', 'http://code.jquery.com/jquery-1.9.0.min.js');
        Asset::add('slick-js', 'js/slick.grid.js');

        parent::__construct();
    }

	/**
	 * Catch-all method for requests that can't be matched.
	 *
	 * @param  string    $method
	 * @param  array     $parameters
	 * @return Response
	 */
	public function __call($method, $parameters)
	{
		return Response::error('404');
	}

}