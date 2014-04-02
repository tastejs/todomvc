class FooterView < Vienna::View
  element '#footer'

  attr_accessor :completed_count, :active_count, :filter

  def render
    total = completed_count + active_count
    total == 0 ? element.hide : element.show
    element.html = template.render(self)
    show_filter
  end

  def show_filter filter
    filters = element.find 'li a'
    filters.remove_class :selected
    filter = @filter.to_s == :all ? '' : @filter
    selector = "a[href=\"#/#{filter}\"]"
    filters.filter(selector).add_class :selected
  end

  def template
    Template['footer']
  end

  def show_completed?
    @completed_count > 0
  end
end
