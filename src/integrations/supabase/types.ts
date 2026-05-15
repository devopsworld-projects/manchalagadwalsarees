export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link: string | null
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          code: string
          created_at: string
          current_balance: number
          expires_at: string | null
          id: string
          initial_value: number
          is_active: boolean
          purchased_by: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          current_balance: number
          expires_at?: string | null
          id?: string
          initial_value: number
          is_active?: boolean
          purchased_by?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          current_balance?: number
          expires_at?: string | null
          id?: string
          initial_value?: number
          is_active?: boolean
          purchased_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          author_initial: string | null
          author_name: string
          created_at: string
          id: string
          is_active: boolean
          profile_photo_url: string | null
          rating: number
          review_date: string | null
          review_text: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_initial?: string | null
          author_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          profile_photo_url?: string | null
          rating?: number
          review_date?: string | null
          review_text: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_initial?: string | null
          author_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          profile_photo_url?: string | null
          rating?: number
          review_date?: string | null
          review_text?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string
          is_active: boolean
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          image_url: string | null
          is_enabled: boolean
          section_key: string
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          is_enabled?: boolean
          section_key: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          is_enabled?: boolean
          section_key?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          menu_group: string
          parent_id: string | null
          slug: string | null
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          menu_group?: string
          parent_id?: string | null
          slug?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          menu_group?: string
          parent_id?: string | null
          slug?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          product_name: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancelled_at: string | null
          coupon_code: string | null
          courier: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount_amount: number
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          shipping_address: string | null
          status: string
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancelled_at?: string | null
          coupon_code?: string | null
          courier?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          shipping_address?: string | null
          status?: string
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancelled_at?: string | null
          coupon_code?: string | null
          courier?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          shipping_address?: string | null
          status?: string
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          created_at: string
          description: string | null
          id: string
          og_image: string | null
          page_path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          og_image?: string | null
          page_path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          og_image?: string | null
          page_path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          order_id: string
          provider: string
          provider_order_id: string | null
          provider_payment_id: string | null
          raw: Json | null
          signature: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          provider?: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          raw?: Json | null
          signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          provider?: string
          provider_order_id?: string | null
          provider_payment_id?: string | null
          raw?: Json | null
          signature?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_tag_map: {
        Row: {
          id: string
          product_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          product_id: string
          tag_id: string
        }
        Update: {
          id?: string
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tag_map_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tag_map_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "product_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          images: string[] | null
          is_active: boolean
          original_price: number | null
          price: number
          product_id: string
          sku: string
          stock: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          images?: string[] | null
          is_active?: boolean
          original_price?: number | null
          price: number
          product_id: string
          sku: string
          stock?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          images?: string[] | null
          is_active?: boolean
          original_price?: number | null
          price?: number
          product_id?: string
          sku?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          colors: string[] | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_best_seller: boolean | null
          is_new: boolean | null
          name: string
          original_price: number | null
          price: number
          sku: string
          specifications: Json
          stock: number | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name: string
          original_price?: number | null
          price: number
          sku: string
          specifications?: Json
          stock?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_new?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          sku?: string
          specifications?: Json
          stock?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      related_products: {
        Row: {
          id: string
          product_id: string
          related_product_id: string
        }
        Insert: {
          id?: string
          product_id: string
          related_product_id: string
        }
        Update: {
          id?: string
          product_id?: string
          related_product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      return_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          order_id: string
          reason: string
          refund_amount: number | null
          refund_reference: string | null
          refunded_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          order_id: string
          reason: string
          refund_amount?: number | null
          refund_reference?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          order_id?: string
          reason?: string
          refund_amount?: number | null
          refund_reference?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_rates: {
        Row: {
          created_at: string
          free_above_amount: number | null
          id: string
          is_active: boolean
          max_weight: number | null
          min_weight: number | null
          name: string
          rate: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          free_above_amount?: number | null
          id?: string
          is_active?: boolean
          max_weight?: number | null
          min_weight?: number | null
          name: string
          rate?: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          free_above_amount?: number | null
          id?: string
          is_active?: boolean
          max_weight?: number | null
          min_weight?: number | null
          name?: string
          rate?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_locations: {
        Row: {
          address: string
          city: string | null
          created_at: string
          directions_url: string | null
          hours: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          map_url: string | null
          name: string
          phone: string | null
          photo_url: string | null
          pincode: string | null
          rating: number | null
          reviews_count: number | null
          sort_order: number
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          city?: string | null
          created_at?: string
          directions_url?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          pincode?: string | null
          rating?: number | null
          reviews_count?: number | null
          sort_order?: number
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          directions_url?: string | null
          hours?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          map_url?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          pincode?: string | null
          rating?: number | null
          reviews_count?: number | null
          sort_order?: number
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      tax_rules: {
        Row: {
          applies_to: string
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          rate: number
          updated_at: string
        }
        Insert: {
          applies_to?: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          rate?: number
          updated_at?: string
        }
        Update: {
          applies_to?: string
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tax_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          rating: number | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          phone: string | null
          pincode: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string
          phone?: string | null
          pincode: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          phone?: string | null
          pincode?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_users_for_admin: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          last_sign_in_at: string
        }[]
      }
      redeem_coupon: {
        Args: { p_code: string; p_order_total: number }
        Returns: {
          code: string
          discount_amount: number
          discount_type: string
          discount_value: number
          id: string
        }[]
      }
      validate_coupon: {
        Args: { p_code: string; p_order_total: number }
        Returns: {
          code: string
          discount_type: string
          discount_value: number
          id: string
          min_order_amount: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
