# frozen_string_literal: true

# Automatically add loading="lazy" to all <img> tags in posts and pages
# to enable native browser lazy loading for below-the-fold images.
Jekyll::Hooks.register [:posts, :pages], :post_render do |item|
  next unless item.output_ext == ".html" || item.output.nil?
  item.output.gsub!(/<img(?!\sloading=)/i, '<img loading="lazy"')
end
